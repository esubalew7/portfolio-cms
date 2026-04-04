import app from "./app.js";         // Import Express app
import connectDB from "./config/db.js"; // Import DB connection function
import dotenv from "dotenv";        // Import dotenv

dotenv.config();                    // Load env variables

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000; // Get port

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});