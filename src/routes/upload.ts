import { Response, Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg, png and webp images are allowed"));
    }
  },
});

router.post(
  "/",
  verifyToken,
  upload.single("image"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      if (!req.file) {
        res.status(400).json({ message: "No image file provided" });
        return;
      }

      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "restrobase",
              transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
            },
            (error, result) => {
              if (error || !result) {
                reject(error ?? new Error("Cloudinary upload failed"));
                return;
              }
              resolve(result);
            },
          );
          uploadStream.end(req.file!.buffer);
        },
      );

      res.status(200).json({
        message: "Image uploaded successfully",
        url: result.secure_url,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default router;
