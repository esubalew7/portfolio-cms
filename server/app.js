import express from "express";          // Import Express framework
import cors from "cors";                // Import CORS middleware
import dotenv from "dotenv";            // Import dotenv for env variables
import contactRoutes from "./routes/contactRoutes.js"; // Import contact routes

dotenv.config();                        // Load environment variables from .env

const app = express();                  // Create Express app instance

// Middleware

app.use(cors());                        // Enable Cross-Origin Resource Sharing
app.use(express.json());                // Parse incoming JSON requests

// Routes
app.use("/api/contact", contactRoutes); // Use routes for contact

// Test Route

app.get("/api/test", (req, res) => {    // Define GET route
  res.status(200).json({                // Send response with status 200
    message: "API working"              // Response data
  });
});

// Export app

export default app;                     // Export app for use in server.js