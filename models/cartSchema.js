import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Restaurant", // Assuming food items are linked to restaurants
                required: true
            },
            name: String,
            price: Number,
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            image: String
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

 export const Cart = mongoose.model("Cart", cartSchema);

