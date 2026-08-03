import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [4000, "Description cannot exceed 4000 characters"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one product image is required",
      },
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Numeric quantity, separate from the manual `inStock` toggle above.
    // Order delivery decrements this automatically (see orderController's
    // updateOrderStatus); the admin's manual "Toggle Stock Status" action
    // still overrides `inStock` directly and is untouched by this field.
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
  },
  { timestamps: true }
);

// Full-text search across name + description for the Shop page search bar.
productSchema.index({ name: "text", description: "text" });

/** Derive a unique slug from `name` whenever it changes, resolving collisions. */
productSchema.pre("validate", async function assignSlug(next) {
  if (!this.isModified("name") && this.slug) return next();

  const base = slugify(this.name);
  let candidate = base;
  let suffix = 1;

  const Product = this.constructor;
  // eslint-disable-next-line no-await-in-loop
  while (await Product.exists({ slug: candidate, _id: { $ne: this._id } })) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  this.slug = candidate;
  next();
});

export const Product = mongoose.model("Product", productSchema);
