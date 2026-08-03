import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createOrder, listOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";

const router = Router();

// Order creation uploads an image and writes to the DB — worth its own,
// tighter limit separate from the general API limiter.
const createOrderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many orders from this device. Please try again later." },
});

router.post("/", createOrderLimiter, upload.single("paymentScreenshot"), createOrder);
router.get("/", authenticate, listOrders);
router.get("/:id", authenticate, getOrderById);
router.patch("/:id/status", authenticate, updateOrderStatus);

export default router;
