// Import express
import express from "express";

// Import controller functions
import { register, login } from "../controllers/authController.js";

// Create router
const router = express.Router();

// ===============================
// @route   POST /api/auth/register
// @desc    Register admin (optional)
// ===============================
router.post("/register", register);

// ===============================
// @route   POST /api/auth/login
// @desc    Login admin
// ===============================
router.post("/login", login);

// Export router
export default router;