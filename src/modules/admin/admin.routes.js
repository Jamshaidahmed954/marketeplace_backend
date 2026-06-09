import express from "express";
import { getDashboardStatsController } from "./admin.controller.js";
import auth from "../../middleware/auth.middleware.js";
import { isAdminRole } from "../../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard operations
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/stats", auth, isAdminRole, getDashboardStatsController);

export default router;
