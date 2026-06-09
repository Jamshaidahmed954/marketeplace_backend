import express from "express";
import { createCategoryController, getAllCategoriesController, updateCategoryController, deleteCategoryController, getCategoryByIdController } from "./category.controller.js";
import { isAdminRole } from "../../middleware/role.middleware.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category operations
 */

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/create", isAdminRole, createCategoryController);

/**
 * @swagger
 * /api/categories/getAll:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/getAll", getAllCategoriesController);

/**
 * @swagger
 * /api/categories/getById/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/getById/:id", getCategoryByIdController);

/**
 * @swagger
 * /api/categories/update/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put("/update/:id", isAdminRole, updateCategoryController);

/**
 * @swagger
 * /api/categories/delete/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.delete("/delete/:id", isAdminRole, deleteCategoryController);

export default router;