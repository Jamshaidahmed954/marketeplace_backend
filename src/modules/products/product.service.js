import prismaClient from '../../config/db.js';
import logger from '../../utils/logger.js';

const createProductService = async (productData) => {
    const product = await prismaClient.product.create({ data: productData });
    logger.info("Product created", { productId: product.id });
    return product;
};

/**
 * Paginated product list.
 * @param {{ skip: number, take: number }} paginationArgs
 * @returns {{ products: object[], total: number }}
 */
const getAllProductsService = async ({ skip = 0, take = 10 } = {}) => {
    const [total, products] = await Promise.all([
        prismaClient.product.count(),
        prismaClient.product.findMany({ 
            skip, 
            take,
            include: {
                category: { select: { id: true, name: true } },
                reviews: { select: { rating: true } }
            }
        }),
    ]);
    
    const productsWithRating = products.map(p => {
        const averageRating = p.reviews.length > 0 
            ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length 
            : 0;
        return { ...p, averageRating };
    });

    return { products: productsWithRating, total };
};

const updateProductService = async (productId, updateData) => {
    const existingProduct = await prismaClient.product.findUnique({
        where: { id: productId },
    });

    if (!existingProduct) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;   // fixed: was returning instead of throwing
    }

    const product = await prismaClient.product.update({
        where: { id: productId },
        data: updateData,
    });
    logger.info("Product updated", { productId });
    return product;
};

const deleteProductService = async (productId) => {
    const existingProduct = await prismaClient.product.findUnique({
        where: { id: productId },
    });

    if (!existingProduct) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }

    const product = await prismaClient.product.delete({ where: { id: productId } });
    logger.info("Product deleted", { productId });
    return product;
};

const getProductByIdService = async (productId) => {
    const product = await prismaClient.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;   // fixed: was returning instead of throwing
    }

    return product;
};

/**
 * Paginated products by category.
 * @param {string} categoryId
 * @param {{ skip: number, take: number }} paginationArgs
 */
const getProductsByCategoryService = async (categoryId, { skip = 0, take = 10 } = {}) => {
    const [total, products] = await Promise.all([
        prismaClient.product.count({ where: { categoryId } }),
        prismaClient.product.findMany({ where: { categoryId }, skip, take }),
    ]);
    return { products, total };
};

export {
    createProductService,
    getAllProductsService,
    updateProductService,
    deleteProductService,
    getProductByIdService,
    getProductsByCategoryService,
};