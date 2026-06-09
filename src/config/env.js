import dotenv from "dotenv";

dotenv.config();

const env = process.env;

export default {
    port: env.PORT || 3000,
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET || "your_jwt_secret",
    jwtExpiresIn: env.JWT_EXPIRES_IN || "1h",
    nodeEnv: env.NODE_ENV || "development",
};