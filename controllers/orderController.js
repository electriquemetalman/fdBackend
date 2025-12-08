import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"
import { notificationQueue } from "../queues/notificationQueue.js";
import { io } from "../server.js";
import notificationModel from "../models/notificationModel.js";



// Placing user order for front
const placeOrder = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const frontend_url = "http://localhost:5173";

    try{
        const userId = req.user.id;
        // create and save new Order
        const newOrder = new orderModel({
            userId:userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save()

        //clean user cart
        await userModel.findByIdAndUpdate(userId, {cartData:{}});

        //construct stript items
        const line_items =req.body.items.map((item) => ({
            price_data:{
                currency:"cad",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"cad",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100
            },
            quantity:1
        })

        //create a stripe session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.status(201).send({
            success: true,
            message: "Order successfully",
            session_url:session.url
        });

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Order Failed",
            error: error.message,
        });

    }

}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body;
    try {
        if (success == "true") {
           const updatedOrder = await orderModel.findByIdAndUpdate(orderId,{payment:true});

           // Add job to notification queue
            await notificationQueue.add("orderVerified", { order: updatedOrder });

                res.status(200).send({
                    success: true,
                    message: "Paid successfully"
                });
        } else {
            await orderModel.findByIdAndDelete(orderId);
                res.status(200).send({
                    success: false,
                    message: "Paid fail"
                });
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Order Fail",
            error: error.message,
        });
    }
}

const userOrders = async (req, res) => {
    try{
        const userId = req.user.id;
        const orders = await orderModel.find({userId});
        res.status(200).send({
            success: true,
            message: "Get User Orders successfully",
            orders: orders
        });
    } catch (error) {
         res.status(401).send({
            success: false,
            message: "Get User Orders Fail",
            error: error.message,
        });
    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).send({
            success: true,
            message: "Orders Listed successfully",
            data: orders
        });
    } catch (error) {
        res.status(401).send({
            success: false,
            message: "List Orders Fail",
            error: error.message,
        });
    }
}

const updateStatus = async (req, res) => {
    const orderId = req.body.orderId;
    const orderStatus = {status: req.body.status};
    try {
       const updatedOrder = await orderModel.findByIdAndUpdate(orderId, orderStatus);

         // Add job to notification queue
        await notificationQueue.add("statusUpdated", { order: updatedOrder });

        res.status(200).send({
            success: true,
            message: "Status Updated",
        });
    } catch (error) {
        res.status(401).send({
            success: false,
            message: "Update Status Fail",
            error: error.message,
        });
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus}