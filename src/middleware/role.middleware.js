import { verifyToken, extractBearerToken } from "../utils/generateToken.js";
import { sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

/**
 * Factory: returns middleware that allows only the specified roles.
 * @param {...string} allowedRoles  e.g. requireRole("ADMIN", "SELLER")
 */
const requireRole = (...allowedRoles) => (req, res, next) => {
    try {
        const token = extractBearerToken(req.headers.authorization);

        if (!token) {
            return sendError(res, { statusCode: 401, message: "Unauthorized: token is required" });
        }

        const decoded = verifyToken(token);

        if (!allowedRoles.includes(decoded.role)) {
            logger.warn("Role check failed", { user: decoded.email, role: decoded.role, required: allowedRoles });
            return sendError(res, {
                statusCode: 403,
                message: `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
            });
        }

        req.user = decoded;
        logger.http(`Role authorised: ${decoded.email} [${decoded.role}]`);
        next();
    } catch (error) {
        logger.warn("Role middleware – invalid/expired token", { error: error.message });
        return sendError(res, { statusCode: 401, message: "Unauthorized: invalid or expired token" });
    }
};

// Pre-built convenience guards
const isAdminRole  = requireRole("ADMIN");
const isBuyerRole  = requireRole("BUYER");
const isSellerRole = requireRole("SELLER");
const isAdminOrSeller = requireRole("ADMIN", "SELLER");

export { requireRole, isAdminRole, isBuyerRole, isSellerRole, isAdminOrSeller };