import express from "express";
import { uploadLocal } from "../middlewares/uploadMiddleware.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { protect } from "../middlewares/authMiddleware.js";
import { throwBadRequest } from "../utils/ApiError.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../upload/profiles");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * @desc    Upload a single file locally with compression
 * @route   POST /api/upload
 * @access  Protected
 */
router.post("/", protect, uploadLocal.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      throwBadRequest("No file provided");
    }

    const isPdf = req.file.mimetype === 'application/pdf';
    
    // We will save to a file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    
    let filename = "";
    let size = 0;
    
    if (isPdf) {
      // Direct save for PDF
      filename = `doc-${uniqueSuffix}.pdf`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      size = req.file.size;
    } else {
      // Compress image using sharp
      filename = `img-${uniqueSuffix}.webp`;
      const filePath = path.join(uploadDir, filename);
      
      const info = await sharp(req.file.buffer)
        .resize(800, 800, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .webp({ quality: 80 }) // compress to webp
        .toFile(filePath);
        
      size = info.size;
    }

    const fileData = {
      url: `/uploads/profiles/${filename}`,
      public_id: filename, 
      originalName: req.file.originalname,
      size: size,
    };

    return sendSuccess(res, fileData, "File uploaded successfully");
  } catch (error) {
    next(error);
  }
});

export default router;
