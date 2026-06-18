// Import express
import express from "express";

// Import controller functions
import { register, login, googleLogin, getMe, logout } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

// Create router
const router = express.Router();

// ===============================
// @route   POST /api/auth/register
// @desc    Register admin (optional)
// ===============================
// Pass controller functions directly. Do not call register() here.
router.post("/register", register);

// ===============================
// @route   POST /api/auth/login
// @desc    Login admin
// ===============================
router.post("/login", login);

// ===============================
// @route   POST /api/auth/google
// @desc    Google OAuth login
// ===============================
router.post("/google", googleLogin);

// ===============================
// @route   GET /api/auth/me
// @desc    Get current user profile
// ===============================
router.get("/me", protect, getMe);

// ===============================
// @route   POST /api/auth/logout
// @desc    Logout (clears HttpOnly cookie)
// ===============================
router.post("/logout", logout);

// Export router
export default router;