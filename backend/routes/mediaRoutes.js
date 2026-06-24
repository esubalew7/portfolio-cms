import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/mediaUpload.js";
import {
  getMedia,
  uploadMedia,
  deleteMedia,
  updateMedia,
  searchMedia,
} from "../controllers/mediaController.js";

const router = express.Router();

router.get("/", getMedia);

router.get("/search", searchMedia);

router.post("/upload", protect, upload.single("image"), uploadMedia);

router.delete("/:id", protect, deleteMedia);

router.patch("/:id", protect, updateMedia);

export default router;
