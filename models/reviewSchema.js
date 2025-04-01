import mongoose from 'mongoose';

// Review Schema
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resturent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        enum: {
            values: [1, 2, 3, 4, 5],
            message: 'Rating must be between 1 and 5',
        },
    },
    reviewText: {
        type: String,
        required: [true, 'Review content is required'],
        minlength: [15, 'Review must be at least 15 characters long'],
        maxlength: [200, 'Review cannot exceed 200 characters'],
    },
    // averageRating: { type: Number, default: 0 },
}, {
    timestamps: true,
});

export const Review = mongoose.model("Review", reviewSchema);
