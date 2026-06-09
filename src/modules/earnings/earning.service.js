import prismaClient from "../../config/db.js";

const getEarningsBySellerService = async (sellerId, { skip = 0, take = 10 } = {}) => {
    const [total, earnings] = await Promise.all([
        prismaClient.earning.count({ where: { sellerId } }),
        prismaClient.earning.findMany({
            where: { sellerId },
            skip,
            take,
            orderBy: { createdAt: 'desc' }
        })
    ]);
    return { total, earnings };
};

const getAllEarningsService = async ({ skip = 0, take = 10 } = {}) => {
    const [total, earnings] = await Promise.all([
        prismaClient.earning.count(),
        prismaClient.earning.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: { seller: { select: { id: true, name: true, storeName: true, email: true } } }
        })
    ]);
    return { total, earnings };
};

export { getEarningsBySellerService, getAllEarningsService };
