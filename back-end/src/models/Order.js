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
