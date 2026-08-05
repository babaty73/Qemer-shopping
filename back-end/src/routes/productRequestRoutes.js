import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  createProductRequest,
  listProductRequests,
  getProductRequestById,
  updateProductRequestStatus,
} from "../controllers/productRequestController.js";

const router = Router();

const createRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this device. Please try again later." },
});

router.post("/", createRequestLimiter, upload.single("image"), createProductRequest);
router.get("/", authenticate, listProductRequests);
router.get("/:id", authenticate, getProductRequestById);
router.patch("/:id/status", authenticate, updateProductRequestStatus);

export default router;
