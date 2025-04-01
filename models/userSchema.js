import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
        default: 'user',
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

export const User = mongoose.model("User", userSchema);


