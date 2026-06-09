import { verifyToken, extractBearerToken } from "../utils/generateToken.js";
import { sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

/**
 * Authenticate any logged-in user.
 * Attaches the decoded JWT payload to req.user.
 */
const auth = (req, res, next) => {
    try {
        const token = extractBearerToken(req.headers.authorization);

        if (!token) {
            return sendError(res, { statusCode: 401, message: "Unauthorized: token is required" });
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        logger.http(`Authenticated user: ${decoded.email} [${decoded.role}]`);
        next();
    } catch (error) {
        logger.warn("Auth middleware – invalid/expired token", { error: error.message });
        return sendError(res, { statusCode: 401, message: "Unauthorized: invalid or expired token" });
    }
};

export default auth;