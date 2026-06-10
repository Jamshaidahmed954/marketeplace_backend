import { createUserService, updateUserService, updatePasswordService, getUserByIdService } from './user.service.js';
import { registerValidation } from '../../middleware/validation.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import logger from '../../utils/logger.js';
import bcrypt from 'bcrypt';

// ─── Register User ────────────────────────────────────────────────────────────
const createUserController = async (req, res, next) => {
    try {
        const { error } = registerValidation(req.body);
        if (error) {
            return sendError(res, { statusCode: 400, message: error.details[0].message });
        }

        const userData = req.body;
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await createUserService({ ...userData, password: hashedPassword });

        logger.http("POST /users – user registered");
        return sendSuccess(res, {
            statusCode: 201,
            message: "User registered successfully",
            data: {
                id:    user.id,
                name:  user.name,
                email: user.email,
                role:  user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─── Update User ──────────────────────────────────────────────────────────────
const updateUserController = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await updateUserService(userId, req.body);

        logger.http(`PATCH /users/${userId} – updated`);
        return sendSuccess(res, {
            statusCode: 200,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// ─── Change Password ──────────────────────────────────────────────────────────
const updatePasswordController = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword } = req.body;

        await updatePasswordService(userId, currentPassword, newPassword);

        logger.http(`PATCH /users/${userId}/password – changed`);
        return sendSuccess(res, {
            statusCode: 200,
            message: "Password updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

// ─── Get Me ───────────────────────────────────────────────────────────────
const getMeController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await getUserByIdService(userId);

        return sendSuccess(res, {
            statusCode: 200,
            message: "Profile fetched successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export { createUserController, updateUserController, updatePasswordController, getMeController };
