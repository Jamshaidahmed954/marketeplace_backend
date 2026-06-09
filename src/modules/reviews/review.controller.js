import { sendSuccess, sendError } from "../../utils/response.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";
import logger from "../../utils/logger.js";
import { createReviewService, getReviewsByProductService, deleteReviewService } from "./review.service.js";

const createReviewController = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;
        
        if (!productId || !rating || rating < 1 || rating > 5) {
            return sendError(res, { statusCode: 400, message: "Invalid review data. 'productId' and 'rating' (1-5) are required." });
        }

        const review = await createReviewService(req.user.id, { productId, rating, comment });
        logger.http("POST /reviews/create – Review added");
        return sendSuccess(res, { statusCode: 201, message: "Review created successfully", data: review });
    } catch (err) {
        next(err);
    }
};

const getReviewsByProductController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { page, limit, skip } = getPaginationParams(req.query);
        
        const { total, reviews } = await getReviewsByProductService(productId, { skip, take: limit });
        
        return sendSuccess(res, {
            statusCode: 200,
            message: "Reviews fetched",
            data: reviews,
            meta: buildPaginationMeta({ page, limit, total }),
        });
    } catch (err) {
        next(err);
    }
};

const deleteReviewController = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const result = await deleteReviewService(reviewId);
        return sendSuccess(res, { statusCode: 200, message: "Review deleted successfully", data: result });
    } catch (err) {
        next(err);
    }
};

export { createReviewController, getReviewsByProductController, deleteReviewController };
