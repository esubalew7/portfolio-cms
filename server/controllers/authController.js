// Import User model
import User from "../models/User.js";

// Import jsonwebtoken
import jwt from "jsonwebtoken";


// ========================================
// @desc    Register new admin (optional)
// @route   POST /api/auth/register
// @access  Public (you can disable later)
// ========================================
// Controller signature is intentionally (req, res) only.
// We do not use next() here because this is not error-handling middleware.
export const register = async (req, res) => {
    try {
        // Get data from request body
        const { email, password } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // -------------------------------
        // CREATE USER
        // -------------------------------
        const user = await User.create({
            email,
            password, // will be hashed automatically in model
        });

        // -------------------------------
        // RESPONSE
        // -------------------------------
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });

    } catch (error) {
        // No next() call here; errors are returned directly in the response.
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};


// ========================================
// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
// ========================================
export const login = async (req, res) => {
    try {
        // Get email and password from request
        const { email, password } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // -------------------------------
        // FIND USER
        // -------------------------------
        const user = await User.findOne({ email });

        // If user not found
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // -------------------------------
        // COMPARE PASSWORD
        // -------------------------------
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // -------------------------------
        // GENERATE JWT TOKEN
        // -------------------------------
        const token = jwt.sign(
            { id: user._id },                // payload (data inside token)
            process.env.JWT_SECRET,          // secret key from .env
            { expiresIn: "7d" }              // token expiry
        );

        // -------------------------------
        // SUCCESS RESPONSE
        // -------------------------------
        res.status(200).json({
            success: true,
            message: "Login successful",
            token, // send token to frontend
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }

};