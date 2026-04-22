// Import Project model (to interact with MongoDB)
import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

// ===============================
// @desc    Create new project
// @route   POST /api/projects
// @access  Admin
// ===============================
export const createProject = async (req, res) => {
    try {
        const { title, description, category, technologies, image, imagePublicId, liveLink, githubLink } = req.body;

        // VALIDATION
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required",
            });
        }

        const normalizedCategory = category?.toLowerCase().trim();
        if (!normalizedCategory) {
            return res.status(400).json({
                success: false,
                message: "Project category is required",
            });
        }

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Project image is required. Upload an image first via /api/upload.",
            });
        }

        // Normalize technologies to array
        const techArray = typeof technologies === "string"
            ? technologies.split(",").map(t => t.trim()).filter(Boolean)
            : (Array.isArray(technologies) ? technologies : []);

        // SAVE TO DATABASE
        const newProject = await Project.create({
            title,
            description,
            category: normalizedCategory,
            technologies: techArray,
            image,
            imagePublicId: imagePublicId || '',
            liveLink,
            githubLink,
        });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// ===============================
// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
// ===============================
export const getAllProjects = async (req, res) => {
    try {
        // Fetch all projects sorted by newest first
        const projects = await Project.find().sort({ createdAt: -1 });

        console.log("Projects fetched");

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// ===============================
// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
// ===============================
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// ===============================
// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Admin
// ===============================
export const updateProject = async (req, res) => {
    try {
        const { title, description, category, technologies, image, liveLink, githubLink } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required",
            });
        }

        const normalizedCategory = category?.toLowerCase().trim();
        if (!normalizedCategory) {
            return res.status(400).json({
                success: false,
                message: "Project category is required",
            });
        }

        // Normalize technologies to array
        const techArray = typeof technologies === "string"
            ? technologies.split(",").map(t => t.trim()).filter(Boolean)
            : (Array.isArray(technologies) ? technologies : []);

        // Find the existing project to preserve its image if no new one is provided
        const existing = await Project.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Use new Cloudinary URL if provided, otherwise keep the existing one
        const imageUrl = image || existing.image;

        // -------------------------------
        // UPDATE IN DATABASE
        // -------------------------------

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                category: normalizedCategory,
                technologies: techArray,
                image: imageUrl,
                liveLink,
                githubLink,
            },
            {
                new: true,          // Return updated document
                runValidators: true, // Run schema validators
            }
        );

        // -------------------------------
        // SUCCESS RESPONSE
        // -------------------------------

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// ===============================
// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Admin
// ===============================
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // -----------------------------------------------
        // DELETE IMAGE FROM CLOUDINARY (non-blocking)
        // -----------------------------------------------
        if (project.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(project.imagePublicId);
                console.log(`Cloudinary image deleted: ${project.imagePublicId}`);
            } catch (cloudErr) {
                // Log but don't block — always remove from DB
                console.error("Failed to delete Cloudinary image:", cloudErr.message);
            }
        }

        // -----------------------------------------------
        // DELETE PROJECT FROM MONGODB
        // -----------------------------------------------
        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Project and associated image deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
