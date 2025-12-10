import express from "express";
import { listNotifications } from "../controllers/notificationController.js";
import authMiddleware from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { ROLES } from "../config/roles.js";

const notificationRouter = express.Router();

/**
 * @swagger
 * /api/notification/list:
 *   get:
 *     tags: [Notification]
 *     summary: List all notifications
 *     description: Retrieve all notifications sorted by most recent first.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notifications Listed Successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/notification'
 *
 *       401:
 *         description: Failed to list notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to List Notifications
 *                 error:
 *                   type: string
 *                   example: Unauthorized or token invalid
 *       500:
 *         description: Internal Server error   
 */
notificationRouter.get("/list", authMiddleware, listNotifications);

export default notificationRouter;