import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import swaggerUi from "swagger-ui-express"
import swaggerSpec  from "./swagger/swagger.js";

import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import notificationRouter from "./routes/notificationRoute.js"
import "./workers/notificationWorker.js"


//charger .env file
dotenv.config();

// app configuration
const app = express()
const port = process.env.PORT

//http server
const server = http.createServer(app);

//socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//wen socket connection is established and disconnected
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User with ID: ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// middlewares
app.use(express.json())
app.use("/images", express.static("uploads"));
app.use("/profiles", express.static("profileImages"));
app.use(cors());

//db connection
connectDB()

// api endpoints
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/notification", notificationRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log("Swagger Docs available at http://localhost:4000/api/docs");

app.get("/", (req, res) => {
  res.status(200).send("Hello from the backend!")
})

// server listener
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})


