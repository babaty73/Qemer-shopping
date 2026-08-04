import { cloudinary } from "../config/cloudinary.js";
import { Order, ORDER_STATUSES } from "../models/Order.js";
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

    const orderItems = [];
    for (const requested of requestedItems) {
      const product = productMap.get(String(requested.productId));
      if (!product) {
        return res.status(400).json({ message: "One of the items in your cart is no longer available" });
      }
      const quantity = Math.max(1, Math.floor(Number(requested.quantity) || 1));
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: requested.color || undefined,
        size: requested.size || undefined,
        quantity,
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
  console.log("Sending accepted payment email to:", order.customer.email);

  const { subject, html } = buildPaymentAcceptedEmail(order);

  await sendEmail({ 
    to: order.customer.email, 
    subject, 
    html 
  });
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
