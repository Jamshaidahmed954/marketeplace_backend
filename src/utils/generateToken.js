/**
 * JWT Token Utility
 *
 * Centralises token generation and verification so no module
 * needs to import jsonwebtoken directly.
 *
 * Usage:
 *   import { generateToken, verifyToken } from '../../utils/generateToken.js';
 *
 *   // Sign
 *   const token = generateToken({ id: user.id, email: user.email, role: user.role });
 *
 *   // Verify
 *   const decoded = verifyToken(token);   // throws on invalid / expired
 */

import jwt from "jsonwebtoken";
import env from "../config/env.js";

/**
 * Generate a signed JWT for the given payload.
 * @param {{ id: string, email: string, role: string }} payload
 * @param {string} [expiresIn]  Override the default expiry from env.
 * @returns {string} Signed JWT string.
 */
const generateToken = (payload, expiresIn = env.jwtExpiresIn) => {
    if (!env.jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(payload, env.jwtSecret, { expiresIn });
};

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {object} Decoded payload.
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyToken = (token) => {
    if (!env.jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.verify(token, env.jwtSecret);
};

/**
 * Extract the raw token string from a Bearer authorization header.
 * Returns null if the header is missing or malformed.
 * @param {string|undefined} authHeader  req.headers.authorization
 * @returns {string|null}
 */
const extractBearerToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    return token || null;
};

export { generateToken, verifyToken, extractBearerToken };
