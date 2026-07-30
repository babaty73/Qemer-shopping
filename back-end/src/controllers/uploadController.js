import { cloudinary } from "../config/cloudinary.js";

/** POST /api/uploads — admin only, multipart field name "image". */
export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "kemer-market/products",
    });

    res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/uploads — admin only. Body: { publicId }. */
export async function deleteImage(req, res, next) {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: "publicId is required" });
    }

    await cloudinary.uploader.destroy(publicId);
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}
