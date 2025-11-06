import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"



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

export {placeOrder}