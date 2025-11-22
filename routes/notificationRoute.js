import express from "express";
import { listNotifications } from "../controllers/notificationController.js";
import authMiddleware from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { ROLES } from "../config/roles.js";

const notificationRouter = express.Router();

notificationRouter.get("/list", authMiddleware, listNotifications);

export default notificationRouter;