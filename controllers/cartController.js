import userModel from  "../models/userModel.js"

//add items to user cart
const addToCart = async (req, res) => {

    try {

        let userData = await userModel.findOne({_id:req.user.id});
        let cartData = await userData.cartData;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1
        }

        await userModel.findByIdAndUpdate(req.user.id, {cartData});
        res.status(201).send({success:true, message:"Added to Cart"});
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false, message:"Error", error: error.message})
    }
    
}

// display user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.user.id);
        let cartData = await userData.cartData;
        res.status(200).send({success:true, message:"Data Display Successfully", data: cartData});
    } catch (error) {
        res.status(500).send({success:false, message:"error", error: error.message});
    }
}

//remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.user.id);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.user.id, {cartData});
        res.status(200).send({success:true, message:"Removed From cart"})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false, message:"Error", error: error.message})
    }
}

export {addToCart, getCart, removeFromCart}