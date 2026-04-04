// Import jsonwebtoken
import jwt from "jsonwebtoken";

// ========================================
// 🔐 AUTH MIDDLEWARE
// ========================================
const protect = (req, res, next) => {
    try {
        let token;

        // -------------------------------
        // GET TOKEN FROM HEADER
        // -------------------------------
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Extract token from "Bearer TOKEN"
            token = req.headers.authorization.split(" ")[1];
        }

        // -------------------------------
        // IF TOKEN NOT FOUND
        // -------------------------------
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token",
            });
        }

        // -------------------------------
        // VERIFY TOKEN
        // -------------------------------
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = decoded;

        // Continue to next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed",
        });
    }
};

// Export middleware
export default protect;