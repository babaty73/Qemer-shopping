import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { upload, verifyImageSignature } from "../middleware/upload.js";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";

const router = Router();

router.post("/", authenticate, upload.single("image"), verifyImageSignature, uploadImage);
router.delete("/", authenticate, deleteImage);

export default router;
