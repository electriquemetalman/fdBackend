import express from "express";
import { addFood, listFood, deleteFood, ListFoodByCategory, updateFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage: storage});


foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/delete/:id", deleteFood);
foodRouter.get("/category/:category", ListFoodByCategory);
foodRouter.put("/update/:id",upload.single('image'), updateFood);




export default foodRouter;