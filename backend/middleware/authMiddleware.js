// Import jsonwebtoken
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ========================================
// 🔐 AUTH MIDDLEWARE
// ========================================
// Reads the JWT from the HttpOnly cookie ("token") instead of the
// Authorization header.  This prevents XSS-based token theft since
// the cookie is not accessible to JavaScript.
const protect = async (req, res, next) => {
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

        const user = await User.findById(decoded.id).select("passwordChangedAt");
        if (!user || (user.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime())) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, please sign in again",
            });
        }

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