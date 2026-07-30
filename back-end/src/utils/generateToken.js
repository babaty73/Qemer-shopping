import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/** Signs a JWT identifying an admin session. */
export function generateToken(adminId) {
  return jwt.sign({ id: adminId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}
