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


  const allFoods=await Food.find().populate("restaurant")
  res.status(200).json({ status:true, msg: "All foods fetched successfully", foods: allFoods });

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


  const foods = await Food.find({ restaurant: restaurantId }).populate("restaurant");

  
  if (!foods.length) {
    return res.status(404).json({ status: false, msg: "No food items found for this restaurant" });
  }

  res.status(200).json({ status: true, msg: "Foods fetched successfully", foods });
});


export const getRestaurantsByFoodName = asyncHandler(async (req, res) => {
  const { foodName } = req.params; // or use req.query.foodName

  // Find all food items with the given name (case-insensitive)
  const foods = await Food.find({ name: { $regex: new RegExp(foodName, 'i') } });

  if (!foods.length) {
    return res.status(404).json({ status: false, msg: "No restaurants found offering this food item" });
  }

  // Get unique restaurant IDs
  const restaurantIds = [...new Set(foods.map(food => food.restaurant.toString()))];

  // Fetch restaurant details
  const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });

  res.status(200).json({
    status: true,
    msg: `Restaurants offering "${foodName}"`,
    data: restaurants
  });
});


export const editFood=asyncHandler(async(req,res)=>{
  
  const { id } = req.params;

  const { name, price, description, category, rating, restaurant, discount, ingredients, availability} = req.body;
    // console.log(req.body);
    // console.log(req.file);
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "food_images",
        });
        imageUrl = result.secure_url;
        }
        const updatedFood = await Food.findByIdAndUpdate(id, {
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
          }, { new: true });
          res.status(200).json({ status:true, msg: "Food item updated successfully", food
            : updatedFood });

})


export const deleteFood = asyncHandler(async (req, res) => {
  const foodId = req.params.id;
  const food = await Food.findById(foodId);

  if (!food) {
    return res.status(404).json({ status: false, msg: "Food item not found" });
  }

  await Food.deleteOne({ _id: foodId });

  res.status(200).json({ status: true, msg: "Food item deleted successfully" });
});

