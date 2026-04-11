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
// @access  Admin
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

// ===============================
// @desc    Toggle read status of a message
// @route   PATCH /api/contact/:id
// @access  Admin
// ===============================
export const toggleReadStatus = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        contact.isRead = !contact.isRead;
        await contact.save();

        res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};


// ===============================
// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Admin
// ===============================
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};