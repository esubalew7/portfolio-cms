// Import Contact model (to interact with MongoDB)
import Contact from "../models/Contact.js";

// ===============================
// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
// ===============================
export const createContact = async (req, res) => {
    try {
        console.log("[contact:create] Incoming request body:", req.body);

        // Destructure data from request body
        const { name, email, message } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        // Check if all fields are provided
        if (!name || !email || !message) {
            console.warn("[contact:create] Validation failed - missing fields", {
                hasName: Boolean(name),
                hasEmail: Boolean(email),
                hasMessage: Boolean(message),
            });
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

        console.log("[contact:create] Message saved successfully", {
            id: newContact._id,
            createdAt: newContact.createdAt,
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
        console.error("[contact:create] Failed to save contact message", error);
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
        console.log("[contact:getAll] Fetching all messages");

        // Fetch all contacts sorted by newest first
        const contacts = await Contact.find().sort({ createdAt: -1 });

        console.log("[contact:getAll] Messages fetched successfully", {
            count: contacts.length,
        });

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error) {
        console.error("[contact:getAll] Failed to fetch messages", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message || "Unknown server error",
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
// @desc    Update read status of a message
// @route   PATCH /api/contact/:id/read
// @access  Public
// ===============================
export const updateReadStatus = async (req, res) => {
    try {
        const { isRead } = req.body;
        if (typeof isRead !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isRead must be a boolean value",
            });
        }

        console.log("[contact:updateReadStatus] Updating message read status", {
            id: req.params.id,
            isRead,
        });

        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Message marked as ${isRead ? "read" : "unread"}`,
            data: updatedContact,
        });
    } catch (error) {
        console.error("[contact:updateReadStatus] Failed to update read status", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update read status",
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
        console.log("[contact:markAsRead] Request received", { id: req.params.id });
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
        console.error("[contact:markAsRead] Failed to mark message as read", error);
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