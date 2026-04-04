// Import mongoose (ODM for MongoDB)
import mongoose from "mongoose";

// Create schema (structure of data in MongoDB)
const contactSchema = new mongoose.Schema(
    {
        // Name field
        name: {
            type: String,        // Data type: String
            required: true,      // Must be provided
            trim: true,          // Remove extra spaces
        },

        // Email field
        email: {
            type: String,        // Data type: String
            required: true,      // Must be provided
            trim: true,          // Remove spaces
            lowercase: true,     // Convert to lowercase
        },

        // Message field
        message: {
            type: String,        // Data type: String
            required: true,      // Must be provided
            trim: true,          // Clean input
        },

        // Created date
        createdAt: {
            type: Date,          // Data type: Date
            default: Date.now,   // Automatically set current date
        },
    },
    {
        timestamps: false, // We already manually added createdAt
    }
);

// Create model from schema
const Contact = mongoose.model("Contact", contactSchema);

// Export model (so we can use in controllers)
export default Contact;