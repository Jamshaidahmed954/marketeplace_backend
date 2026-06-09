import express from "express";
import upload from "./uploads.services.js";
import { uploadFileController } from "./uploads.controller.js";
import auth from "../../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload operations
 */

/**
 * @swagger
 * /api/uploads/upload:
 *   post:
 *     summary: Upload a single file
 *     tags:
 *       - Uploads
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 */
router.post(
   "/upload",
   auth,
   upload.single("file"),
   uploadFileController
);

export default router;