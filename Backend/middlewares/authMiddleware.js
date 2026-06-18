import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { throwUnauthorized, throwForbidden } from "../utils/ApiError.js";

/**
 * Middleware to protect routes with JWT Bearer Token validation.
 * Appends the validated user database object to `req.user`.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database, excluding the password field
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        throwUnauthorized("Not authorized, user not found in registry.");
      }

      if (user.status !== "Active") {
        throwUnauthorized("Not authorized, user account is inactive.");
      }

      // Attach user object to request
      req.user = user;
      next();
    } catch (error) {
      // If error is already our custom ApiError thrown above, pass it along
      if (error.statusCode) {
        return next(error);
      }
      
      // Otherwise, handle general token expiration/signature verification errors
      next(
        error.name === "TokenExpiredError"
          ? throwUnauthorized("Session expired. Please log in again.")
          : throwUnauthorized("Not authorized, security token signature validation failed.")
      );
    }
  } else {
    // If authorization header is missing
    next(throwUnauthorized("Not authorized, authentication token is missing."));
  }
};

/**
 * Middleware to restrict route access by User Roles.
 * Throws 403 Forbidden if user's role is not allowed.
 * 
 * @param {...string} roles - Permitted user roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        throwForbidden(`Access denied. Role '${req.user?.role || "unknown"}' does not have permission.`)
      );
    }
    next();
  };
};

export default protect;
export { protect, authorizeRoles };
