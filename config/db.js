import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://eleccode:5psOOMDoL3vPezI7@cluster0.ebir3yj.mongodb.net/ludi-food');
        console.log("DB Connected successfully");
    } catch (error) {
        console.error("DB Connection failed:", error.message);
        process.exit(1);
    }
}