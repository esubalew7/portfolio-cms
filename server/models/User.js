// Import mongoose
import mongoose from "mongoose";

// Import bcrypt for hashing passwords
import bcrypt from "bcryptjs";

// Create user schema
const userSchema = new mongoose.Schema(
    {
        // Email field
        email: {
            type: String,        // Data type
            required: true,      // Must be provided
            unique: true,        // No duplicate emails
            trim: true,          // Remove spaces
            lowercase: true,     // Convert to lowercase
        },

        // Password field
        password: {
            type: String,        // Stored as hashed string
            required: true,
            minlength: 6,        // Minimum length
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt automatically
    }
);


// ========================================
// 🔐 HASH PASSWORD BEFORE SAVING
// ========================================
userSchema.pre("save", async function (next) {
    // Only hash if password is modified
    if (!this.isModified("password")) {
        return next();
    }

    // Generate salt (adds randomness)
    const salt = await bcrypt.genSalt(10);

    // Hash password
    this.password = await bcrypt.hash(this.password, salt);

    next();
});


// ========================================
// 🔐 COMPARE PASSWORD METHOD
// ========================================
userSchema.methods.comparePassword = async function (enteredPassword) {
    // Compare entered password with hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};


// Create model
const User = mongoose.model("User", userSchema);

// Export model
export default User;