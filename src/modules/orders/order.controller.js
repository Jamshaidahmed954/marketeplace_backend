import { sendSuccess, sendError } from "../../utils/response.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";
import logger from "../../utils/logger.js";
import { getOrdersBySellerIdService, createOrderService, getAllOrdersService, getOrderByIdService, updateOrderStatusService } from "./order.service.js";

const createOrderController = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId) {
            return sendError(res, { statusCode: 400, message: "productId is required" });
        }

        const order = await createOrderService(req.user.id, { productId, quantity });
        return sendSuccess(res, { statusCode: 201, message: "Order created successfully", data: order });
    } catch (err) {
        next(err);
    }
};

const getOrdersController = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { total, orders } = await getAllOrdersService({ skip, take: limit });

        return sendSuccess(res, {
            statusCode: 200,
            message: "Orders fetched",
            data: orders,
            meta: buildPaginationMeta({ page, limit, total }),
        });
    } catch (err) {
        next(err);
    }
};

const getOrderByIdController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await getOrderByIdService(orderId);
        return sendSuccess(res, { statusCode: 200, message: "Order fetched", data: order });
    } catch (err) {
        next(err);
    }
};

const updateOrderStatusController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return sendError(res, { statusCode: 400, message: "Status is required" });
        }

        const updatedOrder = await updateOrderStatusService(orderId, status);
        return sendSuccess(res, { statusCode: 200, message: "Order status updated", data: updatedOrder });
    } catch (err) {
        next(err);
    }
};

const getOrdersBySellerIdController = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const { page, limit, skip } = getPaginationParams(req.query);
        const { total, orders } = await getOrdersBySellerIdService(sellerId, { skip, take: limit });

        return sendSuccess(res, {
            statusCode: 200,
            message: "Seller's orders fetched",
            data: orders,
            meta: buildPaginationMeta({ page, limit, total }),
        });
    } catch (err) {
        next(err);
    }

}

export {
    createOrderController,
    getOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    getOrdersBySellerIdController
};
