import { sendSuccess } from "../../utils/response.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";
import logger from "../../utils/logger.js";
import { getEarningsBySellerService, getAllEarningsService } from "./earning.service.js";

const getMyEarningsController = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { total, earnings } = await getEarningsBySellerService(req.user.id, { skip, take: limit });

        logger.http(`GET /earnings/my – seller ${req.user.id}`);
        return sendSuccess(res, {
            statusCode: 200,
            message: "Earnings fetched",
            data: earnings,
            meta: buildPaginationMeta({ page, limit, total }),
        });
    } catch (err) {
        next(err);
    }
};

const getAllEarningsController = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { total, earnings } = await getAllEarningsService({ skip, take: limit });

        return sendSuccess(res, {
            statusCode: 200,
            message: "All earnings fetched",
            data: earnings,
            meta: buildPaginationMeta({ page, limit, total }),
        });
    } catch (err) {
        next(err);
    }
};

export { getMyEarningsController, getAllEarningsController };
