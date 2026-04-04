// Import mongoose (ODM for MongoDB)
import mongoose from "mongoose";

// Create schema (structure of data in MongoDB)
const projectSchema = new mongoose.Schema(
    {
        // Title field
        title: {
            type: String,        // Data type: String
            required: true,      // Must be provided
            trim: true,          // Remove extra spaces
        },

        // Description field
        description: {
            type: String,        // Data type: String
            required: true,      // Must be provided
            trim: true,          // Clean input
        },

        // Technologies field (array of strings)
        technologies: [{
            type: String,        // Data type: String
            trim: true,          // Clean input
        }],

        // Image URL field
        image: {
            type: String,        // Data type: String
            trim: true,          // Clean input
        },

        // Live link field
        liveLink: {
            type: String,        // Data type: String
            trim: true,          // Clean input
        },

        // GitHub link field
        githubLink: {
            type: String,        // Data type: String
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
const Project = mongoose.model("Project", projectSchema);

// Export model (so we can use in controllers)
export default Project;