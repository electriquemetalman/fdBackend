import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import validateUser from "../middleware/validateUser.js";

const userRouter = express.Router();

userRouter.post("/register", validateUser, registerUser);
userRouter.post("/login", loginUser);

export default userRouter;