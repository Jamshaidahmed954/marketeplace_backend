import express from "express";
import { getMyEarningsController, getAllEarningsController } from "./earning.controller.js";
import auth from "../../middleware/auth.middleware.js";
import { isAdminRole, isSellerRole } from "../../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Earnings
 *   description: Earning operations
 */

/**
 * @swagger
 * /api/earnings/my:
 *   get:
 *     summary: Get my earnings
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/my",    auth, isSellerRole, getMyEarningsController);

/**
 * @swagger
 * /api/earnings/all:
 *   get:
 *     summary: Get all earnings
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/all",   auth, isAdminRole,  getAllEarningsController);

export default router;
