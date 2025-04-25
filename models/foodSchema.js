import mongoose from "mongoose";


const foodSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
     
    },
    discount: {
        type: Number,
       
    },
    ingredients: {
        type: Array,
       
    },
    availability: {
        type: Boolean,
        required: true
    },
    restaurant:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
})
export const Food = mongoose.model("Food", foodSchema);