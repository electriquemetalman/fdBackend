import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

/**
 * @swagger
 * /api/cart/add:
 *  post:
 *     summary: Add a food item to cart
 *     tags: [Cart]
 *     description: Add a food item to cart using itemId
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: [itemId]
 *                      properties:
 *                          itemId:
 *                              type: string
 *                              description: ID of the item to add
 *                              example: "67a5f22ae4b03ff23b1c1290" 
 *     responses:
 *          201:
 *              description: Food item add to cart successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *                              message:
 *                                  type: string
 *                                  example: Added to Cart successfully
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      user:
 *                                          $ref: '#/components/User'
 *          400:
 *              description: Invalid input
 *          500:
 *              description: Internal Server error  
 */
cartRouter.post("/add", authMiddleware, addToCart)
/**
 * @swagger
 * /api/cart/display:
 *   post:
 *     summary: Get the user's cart contents
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: User cart fetched successfully
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
 *                   example: Data Display Successfully
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   example:
 *                     "67a5f22ae4b03ff23b1c1290": 2
 *                     "67a5f401e4b03ff23b1c12a3": 1
 *       401:
 *         description: error som ting wrong 
 *       500:
 *         description: Internal Server error
 */
cartRouter.post("/display", authMiddleware, getCart)
/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     tags: [Cart] 
 *     summary: Remove an food item from the users cart
 *     description: Decreases the quantity of the specified food item in the authenticated users cart. If the quantity is already 0, it stays unchanged.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID of the food item to remove
 *                 example: "673fe3c1ab98de23ef12b4a9"
 *  
 *     responses:
 *       200:
 *         description: food Item removed successfully
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
 *                   example: "Removed From cart"
 *
 *       401:
 *         description: Unauthorized – token invalid or missing
 *
 *       500:
 *         description: Internal Server Error
 */
cartRouter.post("/remove", authMiddleware, removeFromCart)

export default cartRouter;