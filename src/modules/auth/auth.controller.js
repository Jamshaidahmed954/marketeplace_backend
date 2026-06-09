import { userloginService } from "./auth.service.js";
import { loginValidation } from "./auth.validation.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import logger from "../../utils/logger.js";

const userLoginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        const { error } = loginValidation({ email, password });
        if (error) {
            return sendError(res, { statusCode: 400, message: error.details[0].message });
        }

        // 2. Call login service
        const result = await userloginService(email, password);

        // 3. Send standardised success response
        logger.http(`POST /auth/login – success [${email}]`);
        return sendSuccess(res, {
            statusCode: 200,
            message: "Login successful",
            data: {
                token: result.token,
                user:  result.user,
            },
        });

    } catch (error) {
        logger.error("Login controller error", { message: error.message });
        next(error); // handed to global error middleware
    }
};

export { userLoginController };