import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  toggleStock,
} from "../controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.get("/:slug", getProductBySlug);

router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);
router.patch("/:id/toggle-featured", authenticate, toggleFeatured);
router.patch("/:id/toggle-stock", authenticate, toggleStock);

export default router;
