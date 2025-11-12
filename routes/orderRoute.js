import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js"
import { authorizeRole } from "../middleware/authorizeRole.js";
import { ROLES } from "../config/roles.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/userorders", authMiddleware, userOrders);
orderRouter.get("/listorders", authMiddleware, authorizeRole(ROLES.ADMIN),  listOrders);
orderRouter.post("/update", authMiddleware, authorizeRole(ROLES.ADMIN), updateStatus);


export default orderRouter;