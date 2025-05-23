import express from "express"
import { createFood, deleteFood, editFood, getAllFoods, getRestaurantsByCategory, getUniqueFoods, searchFood } from "../controllers/foodController.js"
import { upload } from "../config/multer.js"


const router=express.Router()


router.post('/create',upload.single('image'),createFood)
router.get('/getall',getAllFoods)
router.get('/unique',getUniqueFoods)
router.get('/restaurants/food/:category',getRestaurantsByCategory)
router.delete('/deletefood/:id',deleteFood)
router.put('/edit-food/:id',editFood)

export  default router
