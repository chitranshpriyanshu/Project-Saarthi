import mongoose from "mongoose";
import userModel from "./user";

const Schema = mongoose.Schema

const enrollSchema = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:"userModel",
    require:[true,"User is Required"]
  },
  course:{
    type:Schema.Types.ObjectId,
    ref:"examModel",
    require:[true,"Course is Required"]

  }
},{
  timestamps:true
})

const enrollModel = mongoose.model("enrollModel",enrollSchema) 
export default enrollModel;