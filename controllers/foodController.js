import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Food } from "../models/foodSchema.js";
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


export const deleteFood=asyncHandler(async(req,res)=>{
  const foodId=req.params.id
  const food=await Food.findById(foodId)
  if(!food){
    return res.status(404).json({ status:false, msg: "Food item not found"
      });
      }
      await food.remove()
      res.status(200).json({ status:true, msg: "Food item deleted successfully" });
      
})
