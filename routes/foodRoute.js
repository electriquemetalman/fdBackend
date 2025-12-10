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

/**
 * @swagger
 * /api/food/add:
 *  post:
 *     summary: Add a food item
 *     tags: [Food]
 *     description: Requires ADMIN role
 *     security:
 *          - bearerAuth: []
 *     requestBody:
 *          required: true
 *              - name
 *              - description
 *              - price
 *              - image
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      required:
 * 
 *                      properties:
 *                          name:
 *                              type: string
 *                          description:
 *                              type: string
 *                          price:
 *                              type: number
 *                          image:
 *                              type: string
 *                              format: binary
 *     responses:
 *          201:
 *              description: Food item add successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/Food'
 *          400:
 *              description: Invalid input
 *          500:
 *              description: Internal Server error  
 */
foodRouter.post("/add", authMiddleware, upload.single("image"), authorizeRole(ROLES.ADMIN), addFood);
/**
 * @swagger
 * /api/food/list:
 *  get:
 *     summary: List all food items
 *     tags: [Food]
 *     description: Returns a list of all available food items.
 *     responses:
 *          200:
 *              description: List of Food items listed successfully.
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
 *                                  example: Food list fetched successfully
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/Food'
 *          401:
 *              description: error som ting wrong
 *          500:
 *              description: Internal Server error  
 */
foodRouter.get("/list", listFood);
/**
 * @swagger
 * /api/food/delete/:id:
 *  delete:
 *     summary: Delete food items
 *     tags: [Food]
 *     security:
 *          - bearerAuth: []
 *     description: Delete one of available food items by Id. **Requires ADMIN role**
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: ID of the food to delete
 *     responses:
 *          200:
 *              description: Food items deleted successfully.
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
 *                                  example: Food Deleted successfully
 *          401:
 *              description: Unauthorized - token missing or invalid.
 *          403:
 *              description: Forbidden - Admin role required.
 *          404:
 *              description: Food item not found.
 *          500:
 *              description: Internal Server error. 
 */
foodRouter.delete("/delete/:id", authMiddleware, authorizeRole(ROLES.ADMIN), deleteFood);
foodRouter.get("/category/:category", ListFoodByCategory);
foodRouter.put("/update/:id",upload.single('image'), updateFood);




export default foodRouter;