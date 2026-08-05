import { cloudinary } from "../config/cloudinary.js";
import { ProductRequest, REQUEST_STATUSES } from "../models/ProductRequest.js";
import { sendEmail } from "../utils/sendEmail.js";
import { buildRequestApprovedEmail, buildRequestDeclinedEmail } from "../emails/requestEmails.js";
import { escapeRegex } from "../utils/escapeRegex.js";

/** POST /api/product-requests — public. Multipart: text fields + optional `image` file. No payment involved. */
export async function createProductRequest(req, res, next) {
  try {
    const { productName, color, size, quantity, email, deliveryAddress, notes } = req.body;

    if (!productName || !color || !size || !quantity || !email || !deliveryAddress) {
      return res.status(400).json({ message: "Missing required request fields" });
    }

    let image;
    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "kemer-market/product-requests",
      });
      image = { url: uploadResult.secure_url, publicId: uploadResult.public_id };
    }

    const request = await ProductRequest.create({
      productName,
      color,
      size,
      quantity: Math.max(1, Math.floor(Number(quantity) || 1)),
      email,
      deliveryAddress,
      notes: notes || undefined,
      image,
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

/** GET /api/product-requests — admin only. Defaults to non-archived; searches product name or email. */
export async function listProductRequests(req, res, next) {
  try {
    const { status, archived, search } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 20));

    const query = { archived: archived === "true" };
    if (status) query.status = status;
    if (search) {
      const pattern = new RegExp(escapeRegex(String(search)), "i");
      query.$or = [{ productName: pattern }, { email: pattern }];
    }

    const [requests, totalResults] = await Promise.all([
      ProductRequest.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      ProductRequest.countDocuments(query),
    ]);

    res.json({
      requests,
      page,
      totalPages: Math.max(1, Math.ceil(totalResults / limit)),
      totalResults,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/product-requests/:id — admin only. */
export async function getProductRequestById(req, res, next) {
  try {
    const request = await ProductRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/product-requests/:id/status — admin only. Body: { status }.
 * Emails the customer on a genuine transition into Approved/Declined,
 * guarded against `previousStatus` so re-saving the same status never re-sends.
 */
export async function updateProductRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!REQUEST_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid request status" });
    }

    const request = await ProductRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const previousStatus = request.status;
    request.status = status;
    await request.save();

    if (status !== previousStatus) {
      if (status === "Approved") {
        const { subject, html } = buildRequestApprovedEmail(request);
        await sendEmail({ to: request.email, subject, html });
      } else if (status === "Declined") {
        const { subject, html } = buildRequestDeclinedEmail(request);
        await sendEmail({ to: request.email, subject, html });
      }
    }

    res.json(request);
  } catch (err) {
    next(err);
  }
}
