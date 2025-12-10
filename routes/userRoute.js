import express from "express";
import { loginUser, registerUser, updateUserProfile, updateUser, getUserById } from "../controllers/userController.js";
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

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [User]
 *     summary: Register a new user
 *     description: Creates a new user account with hashed password.
 *     requestBody:
 *       required: true
 *          - name
 *          - email
 *          - password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: mon nom
 *               email:
 *                 type: string
 *                 example: nom@gmail.com
 *               password:
 *                 type: string
 *                 example: MyStrongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                      user:
 *                          $ref: '#/components/User'
 *                      token:
 *                          type: string
 *                          example: 
 *                              token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTI5ODUwMmJhYTgwZTM1YzkzZjIzZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTM0MzkyNSwiZXhwIjoxNzY1NDMwMzI1fQ.LMNk3yJIZFF_EgtxbXJ6Gn4vfjq5qtzrVqv8nB1pcoM 
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
userRouter.post("/register", validateUser, registerUser);
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [User]
 *     summary: Authenticate user
 *     description: Validate credentials and return user information with a JWT token.
 *     requestBody:
 *       required: true
 *          - email
 *          - password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: nom@gmail.com
 *               password:
 *                 type: string
 *                 example: MyStrongPassword123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: User login successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                      user:
 *                          $ref: '#/components/User'
 *                      token:
 *                          type: string
 *                          example: 
 *                              token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTI5ODUwMmJhYTgwZTM1YzkzZjIzZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTM0MzkyNSwiZXhwIjoxNzY1NDMwMzI1fQ.LMNk3yJIZFF_EgtxbXJ6Gn4vfjq5qtzrVqv8nB1pcoM 
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server error
 */
userRouter.post("/login", loginUser);
/**
 * @swagger
 * /api/user/updateProfile:
 *   post:
 *     tags: [User]
 *     summary: Update user profile picture
 *     description: Upload a new profile image and replace the previous one.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [profile]
 *             properties:
 *               profile:
 *                 type: string
 *                 description: Profile image file
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Image missing
 *       401:
 *         description: Unauthorized - token missing or invalid.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server error
 */
userRouter.post("/updateProfile", authMiddleware, authorizeRole(ROLES.ADMIN, ROLES.USER), upload.single("profile"), updateUserProfile);
/**
 * @swagger
 * /api/user/updateUser:
 *   post:
 *     tags: [User]
 *     summary: Update user information
 *     description: Update the name and email of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name:
 *                 type: string
 *                 example: mon nom
 *               email:
 *                 type: string
 *                 example: nom@gmail.com
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                      user:
 *                          $ref: '#/components/User'
 *       403:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server error
 */
userRouter.post("/updateUser", authMiddleware, updateUser);
/**
 * @swagger
 * /api/user/getUser:
 *   get:
 *     tags: [User]
 *     summary: Get authenticated user profile
 *     description: Returns the currently logged-in user's information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server error
 */
userRouter.get("/getUser", authMiddleware, getUserById);

export default userRouter;