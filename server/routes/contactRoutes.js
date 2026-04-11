// Import express
import express from "express";
import protect from "../middleware/authMiddleware.js"; // Import auth middleware

// Import controller functions
import {
    createContact,
    getAllContacts,
    toggleReadStatus,
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
// @access  Admin
// ===============================
router.get("/", protect, getAllContacts); // Add protect middleware to get all contacts

// ===============================
// @route   PATCH /api/contact/:id
// @desc    Toggle read status
// @access  Admin
// ===============================
router.patch("/:id", protect, toggleReadStatus);

// ===============================
// @route   DELETE /api/contact/:id
// @desc    Delete a contact message
// @access  Admin
// ===============================
router.delete("/:id", protect, deleteContact);

// Export router
export default router;