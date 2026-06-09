import prismaClient from "../../config/db.js";
import logger from "../../utils/logger.js";

const createCategoryService = async (categoryData) => {
    const existingCategory = await prismaClient.category.findUnique({  // fixed typo: findUanique → findUnique
        where: { name: categoryData.name.trim().toLowerCase() },
    });

    if (existingCategory) {
        const error = new Error("Category name already exists");
        error.status = 409;
        throw error;  // fixed: was returning instead of throwing
    }

    const category = await prismaClient.category.create({ data: categoryData });
    logger.info("Category created", { name: category.name });
    return category;
};

const getAllCategoriesService = async ({ skip = 0, take = 10 } = {}) => {
    const [total, categories] = await Promise.all([
        prismaClient.category.count(),
        prismaClient.category.findMany({ skip, take }),
    ]);
    return { categories, total };
};

const updateCategoryService = async (categoryId, updateData) => {
    const existingCategory = await prismaClient.category.findUnique({
        where: { id: categoryId },
    });

    if (!existingCategory) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;  // fixed: was returning instead of throwing
    }

    const category = await prismaClient.category.update({
        where: { id: categoryId },
        data:  updateData,
    });
    logger.info("Category updated", { categoryId });
    return category;
};

const deleteCategoryService = async (categoryId) => {
    const existingCategory = await prismaClient.category.findUnique({
        where: { id: categoryId },
    });

    if (!existingCategory) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }

    await prismaClient.category.delete({ where: { id: categoryId } });
    logger.info("Category deleted", { categoryId });
    return { message: "Category deleted successfully" };
};

const getCategoryByIdService = async (categoryId) => {
    const category = await prismaClient.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }
    return category;
};

export {
    createCategoryService,
    getAllCategoriesService,
    updateCategoryService,
    deleteCategoryService,
    getCategoryByIdService,
};
