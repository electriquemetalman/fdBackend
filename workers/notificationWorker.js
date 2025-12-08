import { Worker } from "bullmq";
import dotenv from "dotenv";
import { io } from "../server.js";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";

dotenv.config();

export const notificationWorker = new Worker("notificationQueue", async job => {
    console.log("Processing notification job:", `${job.name}`);

    switch (job.name) {
        case "foodAdded":
            return await handleFoodAddedNotification(job.data);

        case "foodDeleted":
            return await handleFoodDeletedNotification(job.data);

        case "orderVerified":
            return await handleOrderVerifiedNotification(job.data);

        case "statusUpdated":
            return await handleStatusUpdatedNotification(job.data);
        default:
            console.log("Unknown job name:", `${job.name}`);
            throw new Error(`Unknown job name: ${job.name}`);

    }
},
{
    connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
    }
}
);

const handleFoodAddedNotification = async (data) => {
    const { food } = data;  
    const users = await userModel.find({}, '_id');
    const notificationsToInsert = users.map(user => ({
        userId: user._id,
        message: `New food item added: ${food.name}`,
        foodId: food._id,
    }));
    await notificationModel.insertMany(notificationsToInsert);
    io.emit("newNotification",{
        message: `New food item added: ${food.name}`,
        food: food,
        createdAt: new Date(),
    });

    console.log("Food added notifications processed.");
}

const handleFoodDeletedNotification = async (data) => {
    const { food } = data;  
    const users = await userModel.find({}, '_id'); 
    const notificationsToInsert = users.map(user => ({
        userId: user._id,
        message: `Food item deleted: ${food.name}`,
        foodId: food._id,
    }));
    await notificationModel.insertMany(notificationsToInsert);
    io.emit("newNotification",{
        message: `Food item deleted: ${food.name}`,
        food: food,
        createdAt: new Date(),
    });

    console.log("Food deleted notifications processed.");
}

const handleOrderVerifiedNotification = async (data) => {
    const { order } = data;  
    const admins = await userModel.find({role: "admin"});
    const notificationsToInsert = admins.map(user => ({
        userId: user._id,
        message: "New order placed",
        foodId: order._id,
    }));
    await notificationModel.insertMany(notificationsToInsert);
    admins.forEach(user => {
        io.to(user._id.toString()).emit("newNotification", {
            message: "New order placed",
            order: order,
            createdAt: new Date(),
        });
    });
    console.log("Order verified notifications processed.");
}

const handleStatusUpdatedNotification = async (data) => {
    const { order } = data;  

    const users = await userModel.findById(order.userId);
    const notification = await notificationModel.create({    
        userId: users._id,
        message: `Your order status has been updated to: ${order.status}`,
        foodId: order._id,
    });
    
    io.to(users._id.toString()).emit("newNotification", {
        message: `Your order status has been updated to: ${order.status}`,
        order: order,
        createdAt: new Date(),
    });
    console.log("Status updated notifications processed.");
}