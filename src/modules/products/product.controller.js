import {
    getProductsByCategoryService,
    createProductService,
    getAllProductsService,
    updateProductService,
    deleteProductService,
    getProductByIdService,
} from "./product.service.js";
import { createProductSchema, updateProductSchema } from "./product.validation.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";
import logger from "../../utils/logger.js";

// ─── Create ───────────────────────────────────────────────────────────────────
const createProductController = async (req, res, next) => {
    try {
        if (req.user && req.user.id) {
            req.body.sellerId = req.user.id;
        }
        const { error, value } = createProductSchema.validate(req.body);
        if (error) {
            return sendError(res, { statusCode: 400, message: error.details[0].message });
        }

        const product = await createProductService(value);
        logger.http("POST /products – product created");
        return sendSuccess(res, { statusCode: 201, message: "Product created successfully", data: product });
    } catch (err) {
        next(err);
    }
};

// ─── Get All (paginated) ──────────────────────────────────────────────────────
const getAllProductsController = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { products, total }   = await getAllProductsService({ skip, take: limit });
        const meta = buildPaginationMeta({ page, limit, total });

        logger.http(`GET /products – page ${page}/${meta.totalPages}`);
        return sendSuccess(res, { statusCode: 200, message: "Products fetched", data: products, meta });
    } catch (err) {
        next(err);
    }
};

// ─── Update ───────────────────────────────────────────────────────────────────
const updateProductController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { error, value } = updateProductSchema.validate(req.body);
        if (error) {
            return sendError(res, { statusCode: 400, message: error.details[0].message });
        }

        const product = await updateProductService(productId, value);
        logger.http(`PATCH /products/${productId} – updated`);
        return sendSuccess(res, { statusCode: 200, message: "Product updated successfully", data: product });
    } catch (err) {
        next(err);
    }
};

// ─── Delete ───────────────────────────────────────────────────────────────────
const deleteProductController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const result = await deleteProductService(productId);
        logger.http(`DELETE /products/${productId} – deleted`);
        return sendSuccess(res, { statusCode: 200, message: "Product deleted successfully", data: result });
    } catch (err) {
        next(err);
    }
};

// ─── Get by ID ────────────────────────────────────────────────────────────────
const getProductByIdController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await getProductByIdService(productId);
        return sendSuccess(res, { statusCode: 200, message: "Product fetched", data: product });
    } catch (err) {
        next(err);
    }
};

// ─── Get by Category (paginated) ─────────────────────────────────────────────
const getProductsByCategoryController = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { page, limit, skip } = getPaginationParams(req.query);
        const { products, total }   = await getProductsByCategoryService(categoryId, { skip, take: limit });
        const meta = buildPaginationMeta({ page, limit, total });

        logger.http(`GET /products/category/${categoryId} – page ${page}/${meta.totalPages}`);
        return sendSuccess(res, { statusCode: 200, message: "Products fetched by category", data: products, meta });
    } catch (err) {
        next(err);
    }
};

export {
    createProductController,
    getAllProductsController,
    updateProductController,
    deleteProductController,
    getProductByIdController,
    getProductsByCategoryController,
};
