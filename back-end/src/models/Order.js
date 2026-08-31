import mongoose from "mongoose";

const { Schema } = mongoose;

export const ORDER_STATUSES = [
  "Pending Verification",
  "Accepted",
  "Preparing",
  "Delivered",
  "Payment Rejected",
  "Cancelled",
];

// Only orders in one of these terminal states can be archived — an order
// still in progress (Pending Verification / Accepted / Preparing) should
// stay in the active list where the admin is tracking it.
export const ARCHIVABLE_ORDER_STATUSES = ["Delivered", "Payment Rejected", "Cancelled"];

/**
 * The order state machine — which status an order is allowed to move to
 * next. Derived directly from the admin dashboard's actual workflow
 * (front-end/src/pages/admin/OrderDetail.tsx): Pending Verification is
 * approved or rejected; an accepted order moves to Preparing, then
 * Delivered. Delivered / Payment Rejected / Cancelled are terminal — no
 * status change is offered from any of them in the UI.
 *
 * "Cancelled" itself has no entry point anywhere in the current UI (no
 * button ever sets it), but it's a fully-declared status — used in
 * ORDER_STATUSES and ARCHIVABLE_ORDER_STATUSES alongside Delivered/Payment
 * Rejected — so it isn't reasonable to make it permanently unreachable via
 * the API. It's allowed from every non-terminal status, matching standard
 * "an order can be cancelled any time before it ships" semantics, without
 * adding any new status or workflow concept beyond what the schema already
 * declares. If that's not the intended use of "Cancelled", this map is the
 * one place to adjust.
 */
export const ORDER_TRANSITIONS = {
  "Pending Verification": ["Accepted", "Payment Rejected", "Cancelled"],
  Accepted: ["Preparing", "Cancelled"],
  Preparing: ["Delivered", "Cancelled"],
  Delivered: [],
  "Payment Rejected": [],
  Cancelled: [],
};

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    // Snapshotted at order time so the order stays accurate even if the
    // product's name/price/image changes or the product is later removed.
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    color: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customer: {
      fullName: { type: String, required: [true, "Full name is required"], trim: true },
      phone: { type: String, required: [true, "Phone number is required"], trim: true },
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
      },
      address: { type: String, required: [true, "Delivery address is required"], trim: true },
    },
    paymentMethod: { type: String, required: [true, "Payment method is required"], trim: true },
    paymentScreenshot: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Order must include at least one item",
      },
    },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending Verification",
      index: true,
    },
    notes: { type: String, trim: true, maxlength: 1000 },
    // Delivered / Payment Rejected / Cancelled orders move here once the
    // admin archives them — see the Archive System milestone. Kept in the
    // schema from the start so no later migration is needed.
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
