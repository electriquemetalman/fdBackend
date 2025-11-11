import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Create token function 
const createToken = (id, role) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET, { expiresIn: '1d' })
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try {
        // check if user exist.
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).send({
                success : false,
                message : "User Doesn't exist"
            });
        }

        // check if password match 
        const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            return res.status(400).send({
                success : false,
                message : "Password Or User Name Is Invalid"
            });
        }

        const token = createToken(user._id, user.role);
        res.status(200).send({
            success: true,
            message: "User Login Successfully",
            user: user,
            token: token
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Login Failed",
            error: error.message,
        });
    }
} 


//register user
const registerUser = async (req,res) => {

    const {name, password, email} = req.body;
    try {
        //checking if user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.status(400).send({
                success : false,
                message : "User already exist"
            })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //crete user
        const newUser = new userModel({
            name : name,
            email : email,
            password : hashedPassword
        })
       const user = await newUser.save();
       const token = createToken(user._id, user.role);
       res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user: user,
            token: token
        });

    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Register User",
            error: error.message,
        });
    }
}

export {loginUser, registerUser}



