import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js"
import { authorizeRole } from "../middleware/authorizeRole.js";
import { ROLES } from "../config/roles.js";

const orderRouter = express.Router();

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     tags: [Order]
 *     summary: Place a new order
 *     description: Creates a new order and returns a Stripe checkout session URL.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/Order'
 *     responses:
 *       201:
 *         description: Order placed successfully
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
 *                   example: Order successfully
 *                 session_url:
 *                   type: string
 *                   example: https://checkout.stripe.com/pay/cs_test_123
 *       401:
 *         description: Order failed
 *       500:
 *         description: Internal Server error
 */
orderRouter.post("/place", authMiddleware, placeOrder);
/**
 * @swagger
 * /api/order/verify:
 *   post:
 *     tags: [Order]
 *     summary: Verify order payment
 *     description: Updates the order payment status after Stripe checkout.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, success]
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 67892ab12cd4557890fe1234
 *               success:
 *                 type: string
 *                 example: "true"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Verification failed
 *       403:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal Server error
 */
orderRouter.post("/verify", verifyOrder);
/**
 * @swagger
 * /api/order/userorders:
 *   get:
 *     tags: [Order]
 *     summary: Get orders of the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders retrieved successfully
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
 *                   example: Get User Orders successfully
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/Order'
 *       401:
 *         description: Failed to get user orders
 *       403:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal Server error
 */
orderRouter.get("/userorders", authMiddleware, userOrders);
/**
 * @swagger
 * /api/order/listorders:
 *   get:
 *     tags: [Order]
 *     summary: List all orders (admin)
 *     security:
 *       - bearerAuth: []
 *     description: Only accessible by admins
 *     responses:
 *       200:
 *         description: Orders listed successfully
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
 *                   example: Orders listed successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/Order'
 *       401:
 *         description: List orders failed
 *       403:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal Server error
 */
orderRouter.get("/listorders", authMiddleware, authorizeRole(ROLES.ADMIN),  listOrders);
/**
 * @swagger
 * /api/order/update:
 *   post:
 *     tags: [Order]
 *     summary: Update order status (admin)
 *     security:
 *       - bearerAuth: []
 *     description: Update status of an order. Only accessible by admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, status]
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 67892ab12cd4557890fe1234
 *               status:
 *                 type: string
 *                 example: "Shipped"
 *     responses:
 *       200:
 *         description: Status updated successfully
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
 *                   example: Orders listed successfully
 *       401:
 *         description: Update failed
 *       403:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal Server error
 */
orderRouter.post("/update", authMiddleware, authorizeRole(ROLES.ADMIN), updateStatus);


export default orderRouter;