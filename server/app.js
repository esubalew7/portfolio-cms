import express from "express";          // Import Express framework
import cors from "cors";                // Import CORS middleware
import dotenv from "dotenv";            // Import dotenv for env variables
import contactRoutes from "./routes/contactRoutes.js"; // Import contact routes
import authRoutes from "./routes/authRoutes.js"; // Import auth routes
import projectRoutes from "./routes/projectRoutes.js"; // Import project routes
import uploadRoutes from "./routes/uploadRoutes.js"; // Import upload routes
import dashboardRoutes from "./routes/dashboardRoutes.js"; // Import dashboard routes

dotenv.config();                        // Load environment variables from .env

const app = express();                  // Create Express app instance

// Middleware

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://portfolio-mern-one-rho.vercel.app'
  ],
  credentials: true
}));                        // Secure CORS for dev/prod
app.use(express.json());                // Parse incoming JSON requests


// Routes
app.use("/api/contact", contactRoutes); // Use routes for contact
app.use("/api/auth", authRoutes);       // Use routes for auth
app.use("/api/projects", projectRoutes); // Use routes for projects
app.use("/api/upload", uploadRoutes);   // Use routes for generic uploads
app.use("/api/dashboard", dashboardRoutes); // Use routes for dashboard stats

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    endpoints: {
      projects: '/api/projects',
      health: '/'
    }
  });
});

// Test Route
app.get("/api/test", (req, res) => {    // Define GET route
  res.status(200).json({                // Send response with status 200
    message: "API working"              // Response data
  });
});

// Export app

export default app;                     // Export app for use in server.js