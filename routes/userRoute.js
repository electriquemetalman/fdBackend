import express from "express";
import { loginUser, registerUser, updateUserProfile, updateUser } from "../controllers/userController.js";
import multer from "multer";
import validateUser from "../middleware/validateUser.js";
import  authMiddleware  from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { ROLES } from "../config/roles.js"; 

const userRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination: "profileImages",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage: storage});

userRouter.post("/register", validateUser, registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/updateProfile", authMiddleware, authorizeRole(ROLES.ADMIN), upload.single("profile"), updateUserProfile);
userRouter.post("/updateUser", authMiddleware, updateUser);

export default userRouter;