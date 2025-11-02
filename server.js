import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"


//charger le fichier .env
dotenv.config();

// app configuration
const app = express()
const port = process.env.PORT

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


