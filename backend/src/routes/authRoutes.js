import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/auth.js";
import { login, me } from "../controllers/authController.js";

const router = Router();

// Tighter than the general API limiter — this is the one route worth
// protecting against credential-stuffing specifically.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

router.post("/login", loginLimiter, login);
router.get("/me", authenticate, me);

export default router;
