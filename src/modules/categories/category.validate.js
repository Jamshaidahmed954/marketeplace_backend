import joi from "joi";

export const createCategorySchema = joi.object({
    name: joi.string().required(),
    description: joi.string().optional(),
});

export const updateCategorySchema = joi.object({
    name: joi.string().optional(),
    description: joi.string().optional(),
});

export const categoryIdParamSchema = joi.object({
    categoryId: joi.string().uuid().required(),
});

