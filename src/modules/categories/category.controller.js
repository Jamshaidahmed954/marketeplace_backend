import {
    createCategoryService,
    getAllCategoriesService,
    updateCategoryService,
    deleteCategoryService,
    getCategoryByIdService,
} from "./category.service.js";
import { createCategorySchema, updateCategorySchema } from "./category.validate.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";
import logger from "../../utils/logger.js";

// ─── Create ───────────────────────────────────────────────────────────────────
const createCategoryController = async (req, res, next) => {
    try {
        const { error } = createCategorySchema.validate(req.body);
        if (error) {
            return sendError(res, {
                statusCode: 400,
                message: "Invalid category data",
                errors: error.details.map((d) => d.message),
            });
        }

        const category = await createCategoryService(req.body);
        logger.http("POST /categories – created");
        return sendSuccess(res, { statusCode: 201, message: "Category created successfully", data: category });
    } catch (error) {
        next(error);
    }
};

// ─── Get All (paginated) ──────────────────────────────────────────────────────
const getAllCategoriesController = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { categories, total } = await getAllCategoriesService({ skip, take: limit });
        const meta = buildPaginationMeta({ page, limit, total });

        logger.http(`GET /categories – page ${page}/${meta.totalPages}`);
        return sendSuccess(res, { statusCode: 200, message: "Categories retrieved successfully", data: categories, meta });
    } catch (error) {
        next(error);
    }
};

// ─── Update ───────────────────────────────────────────────────────────────────
const updateCategoryController = async (req, res, next) => {
    try {
        const { error } = updateCategorySchema.validate(req.body);
        if (error) {
            return sendError(res, {
                statusCode: 400,
                message: "Invalid category data",
                errors: error.details.map((d) => d.message),
            });
        }

        const category = await updateCategoryService(req.params.id, req.body);
        logger.http(`PATCH /categories/${req.params.id} – updated`);
        return sendSuccess(res, { statusCode: 200, message: "Category updated successfully", data: category });
    } catch (error) {
        next(error);
    }
};

// ─── Delete ───────────────────────────────────────────────────────────────────
const deleteCategoryController = async (req, res, next) => {
    try {
        const result = await deleteCategoryService(req.params.id);
        logger.http(`DELETE /categories/${req.params.id} – deleted`);
        return sendSuccess(res, { statusCode: 200, message: "Category deleted successfully", data: result });
    } catch (error) {
        next(error);
    }
};

// ─── Get by ID ────────────────────────────────────────────────────────────────
const getCategoryByIdController = async (req, res, next) => {
    try {
        const category = await getCategoryByIdService(req.params.id);
        return sendSuccess(res, { statusCode: 200, message: "Category retrieved successfully", data: category });
    } catch (error) {
        next(error);
    }
};

export {
    createCategoryController,
    getAllCategoriesController,
    updateCategoryController,
    deleteCategoryController,
    getCategoryByIdController,
};
