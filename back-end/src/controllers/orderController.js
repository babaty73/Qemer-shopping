import { cloudinary } from "../config/cloudinary.js";
import { Order, ORDER_STATUSES, ARCHIVABLE_ORDER_STATUSES } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { sendEmail } from "../utils/sendEmail.js";
import { buildPaymentAcceptedEmail, buildPaymentRejectedEmail } from "../emails/orderEmails.js";

/**
 * POST /api/orders — public. Multipart: text fields + `items` (JSON string
 * of [{ productId, quantity, color, size }]) + `paymentScreenshot` file.
 * Prices are never trusted from the client — every line is re-priced from
 * the current Product record.
 */
export async function createOrder(req, res, next) {
  try {
    const { fullName, phone, email, address, paymentMethod, notes, items } = req.body;

    if (!fullName || !phone || !email || !address || !paymentMethod || !items) {
      return res.status(400).json({ message: "Missing required order fields" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "A payment screenshot is required" });
    }

    let requestedItems;
    try {
      requestedItems = JSON.parse(items);
    } catch {
      return res.status(400).json({ message: "Invalid items payload" });
    }
    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const productIds = requestedItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // Sanity bound on a single line's quantity — this is anti-abuse/anti-
    // mistake input validation, NOT a stock/inventory policy. Orders are
    // intentionally allowed to request more than a product's current
    // `stock` value: every order sits in "Pending Verification" for a
    // human admin to review before it's ever accepted, and stock is only
    // decremented when an order is marked "Delivered" (see
    // updateOrderStatus below). Enforcing stock availability here would
    // change that intended workflow, so it's deliberately not done.
    const MAX_ITEM_QUANTITY = 100;

    const orderItems = [];
    for (const requested of requestedItems) {
      const product = productMap.get(String(requested.productId));
      if (!product) {
        return res.status(400).json({ message: "One of the items in your cart is no longer available" });
      }

      const requestedQuantity = Number(requested.quantity);
      if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1 || requestedQuantity > MAX_ITEM_QUANTITY) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
      }

      if (requested.color && !product.colors.includes(requested.color)) {
        return res
          .status(400)
          .json({ message: `"${requested.color}" is not an available color for ${product.name}` });
      }
      if (requested.size && !product.sizes.includes(requested.size)) {
        return res
          .status(400)
          .json({ message: `"${requested.size}" is not an available size for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: requested.color || undefined,
        size: requested.size || undefined,
        quantity: requestedQuantity,
      });
    }

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "kemer-market/payment-screenshots",
    });

    const order = await Order.create({
      customer: { fullName, phone, email, address },
      paymentMethod,
      paymentScreenshot: { url: uploadResult.secure_url, publicId: uploadResult.public_id },
      items: orderItems,
      totalPrice,
      notes: notes || undefined,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

/** GET /api/orders — admin only. Defaults to non-archived orders. */
export async function listOrders(req, res, next) {
  try {
    const { status, archived } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 20));

    const query = { archived: archived === "true" };
    if (status) query.status = status;

    const [orders, totalResults] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Order.countDocuments(query),
    ]);

    res.json({ orders, page, totalPages: Math.max(1, Math.ceil(totalResults / limit)), totalResults });
  } catch (err) {
    next(err);
  }
}

/** GET /api/orders/:id — admin only. */
export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/orders/:id/status — admin only. Body: { status }.
 * Transitioning into "Delivered" reduces stock for each ordered product;
 * a product that hits zero stock is flipped to inStock: false rather than
 * deleted, so it stays visible (as "Out of Stock") for browsing and custom
 * requests. Guarded by `wasAlreadyDelivered` so re-saving an already-
 * delivered order (e.g. re-submitting the same status) never double-decrements.
 * Transitioning into "Accepted" or "Payment Rejected" emails the customer —
 * guarded the same way, against `previousStatus`, so re-saving the same
 * status never re-sends the email.
 */
export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const previousStatus = order.status;
    const wasAlreadyDelivered = previousStatus === "Delivered";
    order.status = status;
    await order.save();

    if (status === "Delivered" && !wasAlreadyDelivered) {
      await Promise.all(
        order.items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) return;

          product.stock = Math.max(0, product.stock - item.quantity);
          if (product.stock === 0) product.inStock = false;
          await product.save();
        })
      );
    }

    if (status !== previousStatus) {
      if (status === "Accepted") {
        const { subject, html } = buildPaymentAcceptedEmail(order);
        await sendEmail({ to: order.customer.email, subject, html });
      } else if (status === "Payment Rejected") {
        const { subject, html } = buildPaymentRejectedEmail(order);
        await sendEmail({ to: order.customer.email, subject, html });
      }
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/orders/:id/archive — admin only. Body: { archived: boolean }.
 * Only orders in a terminal status (Delivered / Payment Rejected /
 * Cancelled) can be archived; archiving is reversible (restore).
 */
export async function setOrderArchived(req, res, next) {
  try {
    const { archived } = req.body;
    if (typeof archived !== "boolean") {
      return res.status(400).json({ message: "archived must be true or false" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (archived && !ARCHIVABLE_ORDER_STATUSES.includes(order.status)) {
      return res
        .status(400)
        .json({ message: `Orders with status "${order.status}" can't be archived yet` });
    }

    order.archived = archived;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}
