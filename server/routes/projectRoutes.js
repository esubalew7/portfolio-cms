// Import express
import express from "express";
import protect from "../middleware/authMiddleware.js"; // Import auth middleware

// Import controller functions
import {
    createProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject,
} from "../controllers/projectController.js";

// Create router instance
const router = express.Router();

// ===============================
// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
// ===============================
router.get("/", getAllProjects);

// ===============================
// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
// ===============================
router.get("/:id", getProject);

// ===============================
// @route   POST /api/projects
// @desc    Create new project
// @access  Admin
// ===============================
router.post("/", protect, createProject);

// ===============================
// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Admin
// ===============================
router.put("/:id", protect, updateProject);

// ===============================
// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Admin
// ===============================
router.delete("/:id", protect, deleteProject);

// Export router
export default router;