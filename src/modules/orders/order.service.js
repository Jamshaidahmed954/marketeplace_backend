import prismaClient from "../../config/db.js";
import logger from "../../utils/logger.js";

const createOrderService = async (buyerId, data) => {
    const { productId, quantity = 1 } = data;

    // 1. Find product and ensure it exists and is active
    const product = await prismaClient.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
        const err = new Error("Product not found or unavailable");
        err.status = 404;
        throw err;
    }

    if (product.stock < quantity) {
        const err = new Error("Insufficient product stock");
        err.status = 400;
        throw err;
    }

    // 2. Calculate total amount
    const totalAmount = product.price * quantity;

    // 3. Create the order and the earning record in a transaction
    // Also deduct stock
    const result = await prismaClient.$transaction(async (prisma) => {
        // Create Order
        const order = await prisma.order.create({
            data: {
                buyerId,
                sellerId: product.sellerId,
                productId,
                quantity,
                totalAmount,
                status: 'PENDING'
            }
        });

        // Deduct stock
        await prisma.product.update({
            where: { id: productId },
            data: { stock: product.stock - quantity }
        });

        // Create Earning for the seller
        await prisma.earning.create({
            data: {
                sellerId: product.sellerId,
                amount: totalAmount,
                orderId: order.id
            }
        });

        return order;
    });

    logger.info("Order created", { orderId: result.id, buyerId });
    return result;
};

const getAllOrdersService = async ({ skip = 0, take = 10 } = {}) => {
    const [total, orders] = await Promise.all([
        prismaClient.order.count(),
        prismaClient.order.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                buyer: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, price: true } }
            }
        })
    ]);
    return { total, orders };
};

const getOrderByIdService = async (orderId) => {
    const order = await prismaClient.order.findUnique({
        where: { id: orderId },
        include: {
            buyer: { select: { id: true, name: true, email: true } },
            seller: { select: { id: true, name: true, storeName: true } },
            product: { select: { id: true, name: true, price: true } }
        }
    });

    if (!order) {
        const err = new Error("Order not found");
        err.status = 404;
        throw err;
    }
    return order;
};

const updateOrderStatusService = async (orderId, newStatus) => {
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
        const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        err.status = 400;
        throw err;
    }

    const order = await prismaClient.order.findUnique({ where: { id: orderId } });
    if (!order) {
        const err = new Error("Order not found");
        err.status = 404;
        throw err;
    }

    const updatedOrder = await prismaClient.order.update({
        where: { id: orderId },
        data: { status: newStatus }
    });

    logger.info("Order status updated", { orderId, newStatus });
    return updatedOrder;
};

const getOrdersBySellerIdService = async (sellerId, { skip = 0, take = 10 } = {}) => {
    const [total, orders] = await Promise.all([
        prismaClient.order.count({ where: { sellerId } }),
        prismaClient.order.findMany({
            where: { sellerId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                buyer: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, price: true } }
            }
        })
    ]);
    return { total, orders };
}

export { createOrderService, getAllOrdersService, getOrderByIdService, updateOrderStatusService, getOrdersBySellerIdService };
