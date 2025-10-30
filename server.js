import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"

// app configuration
const app = express()
const port = 4000

// middlewares
app.use(express.json())
app.use("/images", express.static("uploads"));
app.use(cors())

//db connection
connectDB()

// api endpoints

app.use("/api/food", foodRouter)

app.get("/", (req, res) => {
  res.status(200).send("Hello from the backend!")
})

// server listener
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

//mongodb+srv://eleccode:5psOOMDoL3vPezI7@cluster0.ebir3yj.mongodb.net/?


