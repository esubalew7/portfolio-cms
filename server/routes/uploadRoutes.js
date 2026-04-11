import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploadController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload a single image to Cloudinary
 * @access  Admin (Protected)
 */
// Using the existing 'upload' middleware configured for Cloudinary
router.post("/", protect, upload.single("image"), uploadImage);

export default router;
