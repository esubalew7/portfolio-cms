// Import express
import express from "express";
import protect from "../middleware/authMiddleware.js"; // Import auth middleware

// Import controller functions
import {
    createContact,
    getAllContacts,
    markMessageAsRead,
    deleteContact,
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
// @access  Public
// ===============================
router.get("/", getAllContacts);

// ===============================
// @route   PUT /api/contact/:id/read
// @desc    Mark a message as read
// @access  Public
// ===============================
router.put("/:id/read", markMessageAsRead);

// ===============================
// @route   DELETE /api/contact/:id
// @desc    Delete a contact message
// @access  Admin
// ===============================
router.delete("/:id", protect, deleteContact);

// Export router
export default router;