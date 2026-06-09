import express from "express";
import {
    createOrderController,
    getOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    getOrdersBySellerIdController
} from "./order.controller.js";
import auth from "../../middleware/auth.middleware.js";
import { isSellerRole } from "../../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order operations
 */

/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - totalAmount
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/create", auth, createOrderController);

/**
 * @swagger
 * /api/orders/getAll:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/getAll", auth, isSellerRole, getOrdersController);

/**
 * @swagger
 * /api/orders/getById/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/getById/:orderId", auth, isSellerRole, getOrderByIdController);

/**
 * @swagger
 * /api/orders/status/{orderId}:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Success
 */
router.patch("/status/:orderId", auth, isSellerRole, updateOrderStatusController);



/**
 * @swagger
 * /api/orders/sellerId/{sellerId}:
 *   get:
 *     summary: Get orders for the logged-in seller
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/sellerId/:sellerId", auth, isSellerRole, getOrdersBySellerIdController);

export default router;
