import prismaClient from "../../config/db.js";
import bcrypt from 'bcrypt';
import logger from "../../utils/logger.js";

const createUserService = async (userData) => {
    const normalizedEmail = userData.email.trim().toLowerCase();

    const existingUser = await prismaClient.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existingUser) {
        const error = new Error("Email already in use");
        error.status = 409;
        throw error;
    }

    const user = await prismaClient.user.create({
        data: { ...userData, email: normalizedEmail },
    });

    logger.info("New user registered", { email: normalizedEmail, role: user.role });
    return user;
};

const updateUserService = async (userId, updateData) => {
    const existingUser = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    const user = await prismaClient.user.update({
        where: { id: userId },
        data:  updateData,
    });
    logger.info("User updated", { userId });
    return user;
};

const updatePasswordService = async (userId, currentPassword, newPassword) => {
    // Check user exists BEFORE comparing password
    const existingUser = await prismaClient.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isPasswordValid) {
        const error = new Error("Current password is incorrect");
        error.status = 401;
        throw error;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data:  { password: hashedNewPassword },
    });

    logger.info("Password updated", { userId });
    return updatedUser;
};

export { createUserService, updateUserService, updatePasswordService };
