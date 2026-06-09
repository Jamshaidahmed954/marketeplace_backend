import joi from 'joi';

const createProductSchema = joi.object({
    name: joi.string().required(),
    price: joi.number().required(),
    description: joi.string().optional(),
    categoryId: joi.string().required().uuid(),
    stock: joi.number().required(),
    images: joi.array().items(joi.string().uri()).optional(),
    sellerId: joi.string().required().uuid(),
    isActive: joi.boolean().default(true),
});


const updateProductSchema = joi.object({
    name: joi.string().optional(),
    price: joi.number().optional(),
    description: joi.string().optional(),
    categoryId: joi.string().optional().uuid(),
    stock: joi.number().optional(),
    images: joi.array().items(joi.string().uri()).optional(),
    isActive: joi.boolean().optional(),
});


export { createProductSchema, updateProductSchema };