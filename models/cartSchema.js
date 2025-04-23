import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        image: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Restaurant', // Only save restaurantId here
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);
