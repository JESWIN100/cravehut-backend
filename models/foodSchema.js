import mongoose from "mongoose";


const foodSchema=new mongoose.Schema({
    

    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
        },
        image:{
            type:String,
            required:true
            },
            description:{
                type:String,
                required:true
                },
                category:{
                    type:String,
                    required:true
                    },
                    rating:{
                        type:Number,
                        required:true
                        },
                        discount:{
                            type:Number,
                            required:true
                        },
                        ingredients:{
                            type:Array,
                            required:true
                        },
                        availability:{
                            type:Boolean,
                            required:true
                        },
                        restaurant:
                         {
                             type: mongoose.Schema.Types.ObjectId,
                              ref: "Restaurant"
                             },
})
export const Food=mongoose.model("Food",foodSchema);