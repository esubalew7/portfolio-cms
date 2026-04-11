export const uploadImage = async (req, res) => {
    try {
        // DEBUG: confirm multer received the file
        console.log('[Upload] req.file:', req.file);
        console.log('[Upload] req.body keys:', Object.keys(req.body));

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }
        res.status(200).json({
            success: true,
            imageUrl: req.file.path,           // Cloudinary secure URL
            imagePublicId: req.file.filename    // e.g. "portfolio-projects/abc123"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message
        });
    }
};
