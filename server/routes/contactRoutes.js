// Import express
import express from "express";

// Import controller functions
import {
    createContact,
    getAllContacts,
} from "../controllers/contactController.js";

// Create router instance
const router = express.Router();

// ===============================
// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
// ===============================
router.post("/", createContact);

// ===============================
// @route   GET /api/contact
// @desc    Get all contact messages
// @access  Public (later Admin)
// ===============================
router.get("/", getAllContacts);

// Export router
export default router;