import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },
    cuisineType: {
        type: String,
        required: true,
        trim: true
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [{
        type: String,
        trim: true
    }],
    operatingHours: {
        open: {
            type: String,
            required: true
        },
        close: {
            type: String,
            required: true
        }
    },
    menuItems: [{
        type: String,
        trim: true
    }],
    deliveryAvailable: {
        type: Boolean,
        default: false
    },

    category:{
        type: String,
       require:true
    },
    offers:{
        type:String,
        require:true
    },
    image: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RestOwner',
        // required: true
      },
}, { timestamps: true });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);


