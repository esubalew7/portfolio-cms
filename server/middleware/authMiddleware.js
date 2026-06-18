// Import jsonwebtoken
import jwt from "jsonwebtoken";

// ========================================
// 🔐 AUTH MIDDLEWARE
// ========================================
// Reads the JWT from the HttpOnly cookie ("token") instead of the
// Authorization header.  This prevents XSS-based token theft since
// the cookie is not accessible to JavaScript.
const protect = (req, res, next) => {
    try {
        // -------------------------------
        // GET TOKEN FROM HTTPONLY COOKIE
        // -------------------------------
        const token = req.cookies?.token;

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