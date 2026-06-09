import { sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

/**
 * Global Express error-handling middleware.
 * Must be registered LAST in server.js / app.js:
 *   app.use(errorMiddleware);
 *
 * Any controller that calls next(error) will land here.
 */
const errorMiddleware = (err, req, res, next) => {
    // Log the full error stack in development, just the message in production
    logger.error(`Unhandled error on [${req.method}] ${req.originalUrl}`, {
        message: err.message,
        status:  err.status || err.statusCode || 500,
        stack:   err.stack,
    });

    const statusCode = err.status || err.statusCode || 500;
    const message    = err.message || "Internal Server Error";

    // Prisma-specific error codes
    if (err.code === "P2002") {
        return sendError(res, { statusCode: 409, message: "A record with that value already exists." });
    }
    if (err.code === "P2025") {
        return sendError(res, { statusCode: 404, message: "Record not found." });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return sendError(res, { statusCode: 401, message: "Invalid token." });
    }
    if (err.name === "TokenExpiredError") {
        return sendError(res, { statusCode: 401, message: "Token has expired." });
    }

    return sendError(res, { statusCode, message });
};

export default errorMiddleware;
