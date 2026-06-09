import prismaClient from "../../config/db.js";
import logger from "../../utils/logger.js";

const createReviewService = async (userId, data) => {
    // Ensure product exists
    const product = await prismaClient.product.findUnique({ where: { id: data.productId } });
    if (!product) {
        const err = new Error("Product not found");
        err.status = 404;
        throw err;
    }

    const review = await prismaClient.review.create({
        data: {
            userId,
            productId: data.productId,
            rating: data.rating,
            comment: data.comment
        }
    });
    
    logger.info("Review created", { reviewId: review.id, productId: data.productId });
    return review;
};

const getReviewsByProductService = async (productId, { skip = 0, take = 10 } = {}) => {
    const [total, reviews] = await Promise.all([
        prismaClient.review.count({ where: { productId } }),
        prismaClient.review.findMany({ 
            where: { productId },
            skip, 
            take,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, profilePicture: true } } }
        })
    ]);
    return { total, reviews };
};

const deleteReviewService = async (reviewId) => {
    const review = await prismaClient.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        const err = new Error("Review not found");
        err.status = 404;
        throw err;
    }
    
    await prismaClient.review.delete({ where: { id: reviewId } });
    logger.info("Review deleted", { reviewId });
    return { message: "Review deleted successfully" };
};

export { createReviewService, getReviewsByProductService, deleteReviewService };
