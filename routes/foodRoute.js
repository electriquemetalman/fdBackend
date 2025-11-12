import express from "express";
import { addFood, listFood, deleteFood, ListFoodByCategory, updateFood } from "../controllers/foodController.js";
import multer from "multer";
import  authMiddleware  from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { ROLES } from "../config/roles.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage: storage});


foodRouter.post("/add", authMiddleware, upload.single("image"), authorizeRole(ROLES.ADMIN), addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/delete/:id", authMiddleware, authorizeRole(ROLES.ADMIN), deleteFood);
foodRouter.get("/category/:category", ListFoodByCategory);
foodRouter.put("/update/:id",upload.single('image'), updateFood);




export default foodRouter;