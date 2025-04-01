import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userSchema.js";
import { Review } from "../models/reviewSchema.js";
import { Restaurant } from "../models/resturentSchema.js";

export const createReview = asyncHandler(async (req, res, next) => {

 
    const {  resturentId, rating, reviewText } = req.body;
const userId=req.user.id

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
    const carExists = await Restaurant.findById(resturentId);
    if (!carExists) {
      return res.status(404).json({ success: false, message: 'resturent not found' });
    }
  
    // Create the review
    const review = new Review({
      user: userId,
      resturent: resturentId,
      rating,
      reviewText,
    });
  
    await review.save();
  
    // Fetch all reviews for the car
    const allReviews = await Review.find({ resturent: resturentId });
  
    // Calculate the average rating
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = (totalRating / allReviews.length).toFixed(2); // Keep 2 decimal places
  
    res.status(201).json({ 
      success: true, 
      message: 'Review created successfully', 
      data: review,
      averageRating: avgRating 
    });
  });
  