import app from "./app.js";         // Import Express app
import connectDB from "./config/db.js"; // Import DB connection function
import dotenv from "dotenv";        // Import dotenv

dotenv.config();                    // Load env variables

// Connect to MongoDB
connectDB().then(async () => {
  const PORT = process.env.PORT || 5000;

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});