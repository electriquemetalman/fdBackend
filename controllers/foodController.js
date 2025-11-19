import foodModel from "../models/foodModel.js";
import notificationModel from "../models/notificationModel.js";
import { io } from "../server.js";
import fs from "fs";

// Create Food Item
const addFood = async (req, res) => {

    if (!req.file) {
      return res.status(400).send({ success: false, message: "Image not found" });
    }

    let image_filename = `${req.file.filename}`;

    const newFood = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category,
    });
    try {
        await newFood.save();

        // Create a notification for the new food item
        const newNotification = new notificationModel({
            message: `New food item added: ${newFood.name}`,
            foodId: newFood._id,
        });
        await newNotification.save();

        // Emit the notification to all connected clients via Socket.io
        io.emit("newNotification", {
            message: newNotification.message,
            food: newFood,
            createdAt: newNotification.createdAt,
        });

        res.status(201).send({
            success: true,
            message: "Food Item Added Successfully",
            food: newFood,
        });
    } catch (error) {
        // Delete the uploaded image if saving to DB fails
        fs.unlinkSync(imagePath);
        res.status(500).send({
            success: false,
            message: "Failed to Add Food Item",
            error: error.message,
        });
    }
}

//all food list

const listFood = async (req, res) => {
    try{
        const foods = await foodModel.find()
        res.status(200).send({
            success: true,
            message: "Foods Listed Successfully",
            data: foods,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to List Foods",
            error: error.message,
        });
    }
}

// List food By Category

const ListFoodByCategory = async(req, res) => {

    const category = req.params.category;
    if (!category) {
            return res.status(404).send({
                success: false,
                message: "Food not found",
            });
    }
    try {
        const FoodCats = await foodModel.find({ category: category });
        
        res.status(200).send({
            success: true,
            message: "Foods Listed Successfully",
            data: FoodCats,
        });
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to List Foods",
            error: error.message,
        });
    }
}

// Update food

const updateFood = async (req, res) => {
    try{

        let updateValue = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
        }

        if (req.file) {
            let image_filename = `${req.file.filename}`;
            updateValue = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: image_filename,
                category: req.body.category,
            }
      
        }

        // find food we want to update
        const foodToUp = await foodModel.findById(req.params.id);
         if (!foodToUp) {
            return res.status(404).send({
                success: false,
                message: "Food not found",
            });
        } else {

            const updatedFood = await foodModel.findByIdAndUpdate(foodToUp.id, updateValue, {new: true})
            res.status(200).send({
                success: true,
                message: "Food Updated Successfully",
                food: updatedFood
            });
        }

    } catch(error){
        res.status(500).send({
            success: false,
            message: "Failed to Update Food",
            error: error.message,
        })
    }

}

//Remove food item

const deleteFood = async(req, res) => {
    try {

        // find food we want to delete
        const food = await foodModel.findById(req.params.id);
         if (!food) {
            return res.status(404).send({
                success: false,
                message: "Food not found",
            });
        }

        // delete image in uploads file
        fs.unlink(`uploads/${food.image}`, ()=>{})

        // Create a notification for the new food item
        const newNotification = new notificationModel({
            message: `New food deleted: ${food.name}`,
            foodId: food._id,
        });
        await newNotification.save();

        // Emit the notification to all connected clients via Socket.io
        io.emit("newNotification", {
            message: newNotification.message,
            food: food,
            createdAt: newNotification.createdAt,
        });

        //delete food in database
        await foodModel.findByIdAndDelete(food.id)
        res.status(200).send({
            success: true,
            message: "Food Delete Successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Delete Food",
            error: error.message,
        });
    }
}

export { addFood, listFood, deleteFood, ListFoodByCategory, updateFood };