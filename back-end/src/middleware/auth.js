import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";

/** Verifies the Bearer JWT and attaches the admin document to req.admin. */
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.id);

    if (!admin) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
