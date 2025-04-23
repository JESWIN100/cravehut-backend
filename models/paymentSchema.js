import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    resturentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    resturentName:{
        type:String,
        require:true,
    },
    resturentImage:{
        type:String,
        require:true,
    },
    orderId: {
            type: String,
            required: true,
        },
    
    totalCost: {
        type: Number,

    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true

    },
    
    data: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
          name: String,
          price: Number,
          image: String,
          quantity: Number,
          restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
        }
      ],
orderStatus:{
    type:String,
    enum: ['placed', 'preparing', 'on-the-way',"delivered","cancelled"],
    default: 'placed' ,
    
},
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'], // Define the allowed values for paymentStatus
        default: 'pending' // Set default value
    },
    confirmedAt: { // Added field to track payment confirmation date
        type: Date,
    },
}, {
    timestamps: true,
});




export const Payment = mongoose.model('Payment', paymentSchema)