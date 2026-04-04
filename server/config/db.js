import mongoose from "mongoose"; // Import mongoose library

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using URI from .env
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // If connection successful
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If error occurs
        console.error(`MongoDB Connection Error: ${error.message}`);

        // Don't exit process, let the caller handle it
        throw error;
    }
};

// Export function so we can use it in server.js
export default connectDB;
