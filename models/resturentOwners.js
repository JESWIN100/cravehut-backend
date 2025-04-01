import mongoose from "mongoose";

const restaurantOwnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
       type: String,
       enum: ['user', 'restaurant'],
        default: 'restaurant',
       },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    confirmPassword:{
      type:String,
      validate:{
        validator:(value)=>value===this.password,
        message:"Confirm password does not match with password"
        }
    }
  },
  { timestamps: true } 
);

export const RestOwner = mongoose.model("RestOwner", restaurantOwnerSchema);


