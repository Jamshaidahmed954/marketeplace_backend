import prismaClient from "../../config/db.js";
import bcrypt from "bcrypt";
import env from "../../config/env.js";
import { generateToken } from "../../utils/generateToken.js";
import logger from "../../utils/logger.js";

const userloginService = async (email, password) => {
    // 1. Find user
    const user = await prismaClient.user.findUnique({
        where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        logger.warn("Failed login attempt", { email });
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    // 3. Generate token via utility
    const token = generateToken({
        id:    user.id,
        email: user.email,
        role:  user.role,
    });

    logger.info("User logged in", { email: user.email, role: user.role });

    // 4. Return safe user data
    return {
        token,
        user: {
            id:    user.id,
            name:  user.name,
            email: user.email,
            role:  user.role,
        },
    };
};

export { userloginService };