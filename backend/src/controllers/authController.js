import { Admin } from "../models/Admin.js";
import { generateToken } from "../utils/generateToken.js";

/** POST /api/admin/login — accepts either username or email as `identifier`. */
export async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Username/email and password are required" });
    }

    const lowered = String(identifier).toLowerCase();
    const admin = await Admin.findOne({
      $or: [{ username: lowered }, { email: lowered }],
    }).select("+passwordHash");

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);
    res.json({
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/admin/me — returns the currently authenticated admin. */
export async function me(req, res) {
  res.json({
    admin: { id: req.admin._id, username: req.admin.username, email: req.admin.email },
  });
}
