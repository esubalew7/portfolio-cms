import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getContent,
  updateContent,
} from "../controllers/contentController.js";

const router = express.Router();

router.get("/", getContent);

router.put("/", protect, updateContent);

export default router;
