import app from "./app.js";         // Import Express app
import connectDB from "./config/db.js"; // Import DB connection function
import dotenv from "dotenv";        // Import dotenv

import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();                    // Load env variables

// Connect to MongoDB
connectDB().then(async () => {
    const PORT = process.env.PORT || 5000;

    // Create admin user if not exists
    await createAdmin();

    // Start server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});





async function createAdmin() {
  try {
    const adminEmail = "esubalew392@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      console.log("Creating default admin account...");
      const hashedPassword = await bcrypt.hash("Esu@1996", 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
      });
      console.log("Admin account created successfully.");
    } else {
      console.log("Admin account already exists.");
    }
  } catch (err) {
    console.error("Error ensuring admin account exists:", err.message);
  }
}

