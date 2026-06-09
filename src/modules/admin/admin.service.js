import prismaClient from "../../config/db.js";

const getDashboardStatsService = async () => {
    const totalUsers = await prismaClient.user.count();
    const totalProducts = await prismaClient.product.count();
    const totalOrders = await prismaClient.order.count();
    
    const earningsAggr = await prismaClient.earning.aggregate({
        _sum: { amount: true }
    });
    
    return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalEarnings: earningsAggr._sum.amount || 0
    };
};

export { getDashboardStatsService };
