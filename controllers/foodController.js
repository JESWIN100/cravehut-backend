import { json } from "stream/consumers";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Food } from "../models/foodSchema.js";
import { Restaurant } from "../models/resturentSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { foodValidation } from "../validation/foodJoiValidation.js";


export const createFood = asyncHandler(async (req, res) => {
  const { name, price, description, category, rating, restaurant,discount,ingredients,availability } = req.body;

  // Validate request body
  const { error } = foodValidation(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details.map((err) => err.message) });
  }

  try {
    // Check if the food item already exists
    const existingFood = await Food.findOne({ name, restaurant });
    if (existingFood) {
      return res.status(400).json({ status:false, msg: "Food item already exists in this restaurant" });
    }
// console.log(resturentId);

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "food_images",
      });
      imageUrl = result.secure_url;
    }


    const newFood = new Food({
      name,
      price,
      description,
      category,
      rating,
      restaurant,
      discount,
      ingredients,
      availability,
      image: imageUrl,
    });

    // Save to database
    await newFood.save();

    res.status(201).json({ status:true, msg: "Food item created successfully", food: newFood });
  } catch (err) {
    res.status(500).json({ status:false, msg: "Server error", error: err.message });
  }
});


export const getAllFoods=asyncHandler(async(req,res)=>{


  const allFoods=await Food.find().sort({ createdAt: -1 }).populate("restaurant")
  res.status(200).json({ status:true, msg: "All foods fetched successfully", foods: allFoods });

})

export const getfoodbyid=asyncHandler(async(req,res)=>{
  const {id}=req.params

  console.log(id);
  

const foodbyid=await Food.findById(id)
console.log(foodbyid);


res.status(200).json({ status:true, msg: " foods fetched successfully", foods: foodbyid });
})



export const getUniqueFoods = asyncHandler(async (req, res) => {
  // Get all foods with restaurant data
  const allFoods = await Food.find().populate("restaurant");

  // Use a Map to store unique food items by name
  const uniqueFoodsMap = new Map();

  allFoods.forEach((food) => {
    // If the food name is not already in the map, add it
    if (!uniqueFoodsMap.has(food.name.toLowerCase())) {
      uniqueFoodsMap.set(food.name.toLowerCase(), food);
    }
  });

  // Convert the Map values to an array
  const uniqueFoods = Array.from(uniqueFoodsMap.values());

  res.status(200).json({
    status: true,
    msg: "Unique foods fetched successfully",
    foods: uniqueFoods,
  });
});


export const getFoodsByRestaurantId = asyncHandler(async (req, res) => {
  const restaurantId  = req.params.id;
const restid=req
console.log(restid);

  const foods = await Food.find({ restaurant: restaurantId }).populate("restaurant");

  
  if (!foods.length) {
    return res.status(404).json({ status: false, msg: "No food items found for this restaurant" });
  }

  res.status(200).json({ status: true, msg: "Foods fetched successfully", foods });
});


export const getRestaurantsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params; // or use req.query.category

  // Find all food items with the given category (case-insensitive)
  const foods = await Food.find({ category: { $regex: new RegExp(category, 'i') } });

  if (!foods.length) {
    return res.status(404).json({ status: false, msg: "No food items found for this category" });
  }

  // Get unique restaurant IDs
  const restaurantIds = [...new Set(foods.map(food => food.restaurant.toString()))];

  // Fetch restaurant details based on the unique restaurant IDs
  const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });

  // Combine food and restaurant details
  const result = foods.map(food => {
    const restaurant = restaurants.find(restaurant => restaurant._id.toString() === food.restaurant.toString());
    return {
      ...food.toObject(),
      restaurantDetails: restaurant || {}, // Add the restaurant details for each food item
    };
  });

  res.status(200).json({
    status: true,
    msg: `Restaurants offering "${category}" foods`,
    data: result, // Return combined food and restaurant details
  });
});




export const editFood = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    name,
    price,
    description,
    category,
    rating,
    restaurant,
    discount,
    ingredients,
    availability,
  } = req.body;

  let updatedFields = {
    name,
    price,
    description,
    category,
    rating,
    restaurant,
    discount,
    ingredients,
    availability,
  };

  // Only update the image if a new file is uploaded
  if (req.file) {
    const result = await cloudinaryInstance.uploader.upload(req.file.path, {
      folder: "food_images",
    });
    updatedFields.image = result.secure_url;
  }

  const updatedFood = await Food.findByIdAndUpdate(id, updatedFields, {
    new: true,
  });

  res.status(200).json({
    status: true,
    msg: "Food item updated successfully",
    food: updatedFood,
  });
});



export const deleteFood = asyncHandler(async (req, res) => {
  const foodId = req.params.id;
  const food = await Food.findById(foodId);

  if (!food) {
    return res.status(404).json({ status: false, msg: "Food item not found" });
  }

  await Food.deleteOne({ _id: foodId });

  res.status(200).json({ status: true, msg: "Food item deleted successfully" });
});


export const searchFood = asyncHandler(async (req, res) => {
  const query = req.query.q?.toString().trim();

  if (!query) {
    return res.status(400).json({ status: false, error: "Search query is required" });
  }

  // 1. Search foods by name, ingredients, or category
  const foodMatches = await Food.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { ingredients: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  }).populate('restaurant');

  // 2. Search restaurants by name
  const matchingRestaurants = await Restaurant.find({
    name: { $regex: query, $options: 'i' }
  });

  // 3. If restaurants matched, find their food items
  let foodsFromRestaurants = [];
  if (matchingRestaurants.length > 0) {
    const restaurantIds = matchingRestaurants.map(r => r._id);
    foodsFromRestaurants = await Food.find({ restaurant: { $in: restaurantIds } }).populate('restaurant');
  }

  // 4. Combine both results and remove duplicates
  const combinedFoods = [...foodMatches, ...foodsFromRestaurants];
  const uniqueFoodsMap = new Map();
  combinedFoods.forEach(food => {
    uniqueFoodsMap.set(food._id.toString(), food);
  });

  const uniqueFoods = Array.from(uniqueFoodsMap.values());

  if (!uniqueFoods.length) {
    return res.status(404).json({ status: false, msg: "No food or restaurant found for this query" });
  }

  res.status(200).json({ status: true, msg: "Search results", foods: uniqueFoods });
});

