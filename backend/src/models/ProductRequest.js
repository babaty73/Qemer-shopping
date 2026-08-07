import mongoose from "mongoose";

const { Schema } = mongoose;

export const REQUEST_STATUSES = ["Pending Review", "Approved", "Declined"];

// Only Approved/Declined (terminal) requests can be archived — a request
// still awaiting review should stay in the active list.
export const ARCHIVABLE_REQUEST_STATUSES = ["Approved", "Declined"];

const productRequestSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 150,
    },
    color: { type: String, required: [true, "Preferred color is required"], trim: true },
    size: { type: String, required: [true, "Preferred size is required"], trim: true },
    quantity: { type: Number, required: true, min: 1 },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    deliveryAddress: { type: String, required: [true, "Delivery address is required"], trim: true },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    notes: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "Pending Review",
      index: true,
    },
    // Approved / Declined requests move here once the admin archives them —
    // see the Archive System milestone. Present from the start, same as Order.
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Lets the admin dashboard search by product name or requester email.
productRequestSchema.index({ productName: "text" });

export const ProductRequest = mongoose.model("ProductRequest", productRequestSchema);
