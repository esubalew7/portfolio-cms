import Contact from "../models/Contact.js";
import { emitMessageNew } from "../socket/emitters.js";
import { createNotification } from "../services/notificationService.js";

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

        const newContact = new Contact({
            name,
            email,
            message,
        });
        await newContact.save();

        await createNotification({
            type: "message",
            title: "New message received",
            description: `From: ${name}`,
            message,
            relatedId: newContact._id,
            relatedModel: "Contact",
        });

        emitMessageNew({
            _id: newContact._id,
            name,
            email,
            message,
            isRead: false,
            createdAt: newContact.createdAt,
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newContact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save message",
            error: error.message || "Unknown server error",
        });
    }
};

// ===============================
// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Public
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
            message: "Failed to fetch messages",
            error: error.message || "Unknown server error",
        });
    }
};

// ===============================
// @desc    Mark a message as read
// @route   PUT /api/contact/:id/read
// @access  Public
// ===============================
export const markMessageAsRead = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        if (contact.isRead) {
            return res.status(200).json({
                success: true,
                message: "Message is already marked as read",
                data: contact,
            });
        }

        contact.isRead = true;
        await contact.save();

        return res.status(200).json({
            success: true,
            message: "Message marked as read",
            data: contact,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to mark message as read",
            error: error.message || "Unknown server error",
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