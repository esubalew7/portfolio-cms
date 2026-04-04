// Import Project model (to interact with MongoDB)
import Project from "../models/Project.js";

// ===============================
// @desc    Create new project
// @route   POST /api/projects
// @access  Admin
// ===============================
export const createProject = async (req, res) => {
    try {
        // Destructure data from request body
        const { title, description, technologies, image, liveLink, githubLink } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        // Check if required fields are provided
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required",
            });
        }

        // -------------------------------
        // SAVE TO DATABASE
        // -------------------------------

        const newProject = await Project.create({
            title,
            description,
            technologies: technologies || [],
            image,
            liveLink,
            githubLink,
        });

        // -------------------------------
        // SUCCESS RESPONSE
        // -------------------------------

        res.status(201).json(newProject);
    } catch (error) {
        // -------------------------------
        // ERROR HANDLING
        // -------------------------------

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
        const { title, description, technologies, image, liveLink, githubLink } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required",
            });
        }

        // -------------------------------
        // UPDATE IN DATABASE
        // -------------------------------

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                technologies: technologies || [],
                image,
                liveLink,
                githubLink,
            },
            {
                new: true, // Return updated document
                runValidators: true, // Run schema validators
            }
        );

        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

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
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};