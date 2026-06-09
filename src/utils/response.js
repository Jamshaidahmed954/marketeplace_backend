/**
 * Standardized API Response Utility
 * Provides consistent success and error response shapes across the entire API.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number}  options.statusCode  - HTTP status code (default: 200)
 * @param {string}  options.message     - Human-readable message
 * @param {*}       [options.data]      - Payload to return to the client
 * @param {object}  [options.meta]      - Optional metadata (pagination, etc.)
 */
const sendSuccess = (res, { statusCode = 200, message = "Success", data = null, meta = null } = {}) => {
    const body = {
        success: true,
        message,
        ...(data !== null && { data }),
        ...(meta !== null && { meta }),
    };
    return res.status(statusCode).json(body);
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number}  options.statusCode  - HTTP status code (default: 500)
 * @param {string}  options.message     - Human-readable error message
 * @param {*}       [options.errors]    - Detailed validation errors or extra info
 */
const sendError = (res, { statusCode = 500, message = "Internal Server Error", errors = null } = {}) => {
    const body = {
        success: false,
        message,
        ...(errors !== null && { errors }),
    };
    return res.status(statusCode).json(body);
};

export { sendSuccess, sendError };
