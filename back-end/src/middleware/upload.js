import multer from "multer";

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed"));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// `fileFilter` above only sees the client-supplied Content-Type header,
// which is trivially spoofable — it's a fast first pass, not real
// validation. These check the file's actual leading bytes ("magic
// numbers") for the handful of raster formats the app ever legitimately
// receives (photos/screenshots from phones and browsers).
function isJpeg(buf) {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

function isPng(buf) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return buf.length >= signature.length && signature.every((byte, i) => buf[i] === byte);
}

function isGif(buf) {
  return buf.length >= 4 && buf.subarray(0, 4).toString("ascii") === "GIF8";
}

function isWebp(buf) {
  return (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

const IMAGE_SIGNATURE_CHECKS = [isJpeg, isPng, isGif, isWebp];

/**
 * Runs after `upload.single(...)` has buffered the file into memory —
 * verifies the actual content is a real image (JPEG/PNG/GIF/WEBP) rather
 * than trusting the Content-Type header alone. Applied on every route that
 * accepts an upload, including the two public ones (order payment
 * screenshots, product request images).
 */
export function verifyImageSignature(req, res, next) {
  if (!req.file) return next(); // let the controller's own "file required" check handle this

  const isValidImage = IMAGE_SIGNATURE_CHECKS.some((check) => check(req.file.buffer));

  if (!isValidImage) {
    return res.status(400).json({ message: "The uploaded file is not a valid image" });
  }

  next();
}
