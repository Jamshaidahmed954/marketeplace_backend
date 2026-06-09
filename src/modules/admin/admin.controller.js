import { sendSuccess } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { getDashboardStatsService } from "./admin.service.js";

const getDashboardStatsController = async (req, res, next) => {
    try {
        const stats = await getDashboardStatsService();
        logger.http("GET /admin/stats");
        
        return sendSuccess(res, {
            statusCode: 200,
            message: "Dashboard stats fetched",
            data: stats
        });
    } catch (err) {
        next(err);
    }
};

export { getDashboardStatsController };
