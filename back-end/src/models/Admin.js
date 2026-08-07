import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 40,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default queries
    },
  },
  { timestamps: true }
);

/** Set (and re-hash) the password. Not a raw field so a hash can never be assigned directly. */
adminSchema.methods.setPassword = async function setPassword(plainPassword) {
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(plainPassword, salt);
};

adminSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

export const Admin = mongoose.model("Admin", adminSchema);
