import { v2 as cloudinary } from "cloudinary";
import multerStorageCloudinary from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer Storage Engine for Cloudinary
const storage = multerStorageCloudinary({
  cloudinary: cloudinary,
  folder: "CyberSentinel_AI/uploads",
  allowedFormats: ["jpg", "jpeg", "png", "webp", "pdf", "docx"],
  filename: function (req, file, cb) {
    cb(undefined, `${Date.now()}-${file.originalname.split(".")[0]}`);
  },
});

export const upload = multer({ storage });
export { cloudinary };
