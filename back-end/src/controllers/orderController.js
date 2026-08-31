import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";
import { Order, ORDER_STATUSES, ORDER_TRANSITIONS, ARCHIVABLE_ORDER_STATUSES } from "../models/Order.js";
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
 * Atomically decrements one product's stock by `quantity`, for use inside
 * the Delivered-transition transaction below. Two conditional
 * findOneAndUpdate calls instead of a plain `$inc`:
 *
 *  1. If there's enough stock (`stock >= quantity`), decrement normally.
 *     The filter and the update run as one atomic operation, so two
 *     concurrent deliveries of the same product can never both read the
 *     same starting value and silently lose one decrement — MongoDB
 *     serializes the two findOneAndUpdate calls against each other.
 *  2. If step 1 finds no matching document (not enough recorded stock —
 *     e.g. two orders for the same product both being delivered around
 *     the same time, or an order that always exceeded stock per
 *     createOrder's documented allowance), clamp to exactly 0 instead of
 *     going negative. This filter (`stock: { $gt: 0 }`) is itself
 *     re-checked atomically at write time, not based on a value read
 *     earlier, so it's correct even if another request changed stock in
 *     between steps 1 and 2 of *this* call.
 *
 * If the product no longer exists, both calls simply match nothing and
 * this is a silent no-op — matching the previous behavior.
 */
async function decrementProductStock(productId, quantity, session) {
  let updated = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true, session }
  );

  if (!updated) {
    updated = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gt: 0 } },
      { $set: { stock: 0 } },
      { new: true, session }
    );
  }

  if (updated && updated.stock === 0 && updated.inStock) {
    await Product.updateOne({ _id: updated._id }, { $set: { inStock: false } }, { session });
  }
}

/**
 * PATCH /api/orders/:id/status — admin only. Body: { status }.
 *
 * Every status change is checked against ORDER_TRANSITIONS (see Order.js)
 * before it's applied — an invalid transition (e.g. Pending Verification
 * -> Delivered, or anything out of a terminal status) is rejected with
 * 400 rather than silently applied. Resubmitting the *same* status the
 * order is already at is always allowed as a no-op (matches the previous
 * behavior for safe retries) and skips both the transition check and any
 * side effects below.
 *
 * Transitioning into "Delivered" reduces stock for each ordered product
 * and, if that brings a product to 0, flips inStock to false (the product
 * stays visible as "Out of Stock" rather than being deleted). This runs
 * inside a MongoDB session transaction together with the order's own
 * status save, so a failure partway through (e.g. the 2nd of 3 products
 * fails to update) rolls back everything — the order's status is never
 * left "Delivered" with only some of its stock decremented. This requires
 * the MongoDB deployment to be a replica set, which is what this app is
 * already documented to run against (see config/db.js) — MongoDB Atlas is
 * always a replica set, including on the free tier. A local standalone
 * `mongodb://` instance without replica set configuration cannot run
 * transactions; this only matters for local development against such a
 * database, not for the deployed target.
 *
 * Transitioning into "Accepted" or "Payment Rejected" emails the customer,
 * guarded the same way (only on a genuine status change), so re-saving
 * the same status never re-sends the email.
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
    const isStatusChange = status !== previousStatus;

    if (isStatusChange) {
      const allowedNextStatuses = ORDER_TRANSITIONS[previousStatus] ?? [];
      if (!allowedNextStatuses.includes(status)) {
        return res.status(400).json({
          message: `Cannot change order status from "${previousStatus}" to "${status}"`,
        });
      }
    }

    const movingToDelivered = status === "Delivered" && isStatusChange;

    if (movingToDelivered) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          order.status = status;
          await order.save({ session });

          for (const item of order.items) {
            // eslint-disable-next-line no-await-in-loop
            await decrementProductStock(item.product, item.quantity, session);
          }
        });
      } finally {
        await session.endSession();
      }
    } else {
      order.status = status;
      await order.save();
    }

    if (isStatusChange) {
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
