// Import Contact model (to interact with MongoDB)
import Contact from "../models/Contact.js";

// ===============================
// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
// ===============================
export const createContact = async (req, res) => {
    try {
        // Destructure data from request body
        const { name, email, message } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        // Check if all fields are provided
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // -------------------------------
        // SAVE TO DATABASE
        // -------------------------------

        const newContact = await Contact.create({
            name,
            email,
            message,
        });

        // -------------------------------
        // SUCCESS RESPONSE
        // -------------------------------

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newContact,
        });
    } catch (error) {
        // -------------------------------
        // ERROR HANDLING
        // -------------------------------

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// ===============================
// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin (for now public)
// ===============================
export const getAllContacts = async (req, res) => {
    try {
        // Fetch all contacts sorted by newest first
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};