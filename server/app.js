import express from "express";          // Import Express framework
import cors from "cors";                // Import CORS middleware
import dotenv from "dotenv";            // Import dotenv for env variables
import contactRoutes from "./routes/contactRoutes.js"; // Import contact routes
import authRoutes from "./routes/authRoutes.js"; // Import auth routes
import projectRoutes from "./routes/projectRoutes.js"; // Import project routes
import uploadRoutes from "./routes/uploadRoutes.js"; // Import upload routes
import dashboardRoutes from "./routes/dashboardRoutes.js"; // Import dashboard routes
import notificationRoutes from "./routes/notificationRoutes.js"; // Import notification routes

dotenv.config();                        // Load environment variables from .env

const app = express();                  // Create Express app instance

// Middleware

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://portfolio-mern-one-rho.vercel.app'
  ],
  credentials: true
}));                        // Secure CORS for dev/prod
app.use(express.json());                // Parse incoming JSON requests


// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Export app
export default app;                     // Export app for use in server.js
