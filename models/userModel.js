import mongoose  from "mongoose";
import {ROLES} from '../config/roles.js';

const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    password : {type : String, required : true},
    profile : {type : String },
    role:{type : String, enum : Object.values(ROLES), default : ROLES.USER},
    cartData : {type : Object, default : {}}
}, {
    minimize : false,
    timestamps : true
});

const userModel = mongoose.model.user || mongoose.model("user",userSchema);
export default userModel;