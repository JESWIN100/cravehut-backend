import express from "express"
import { createFood, deleteFood, getAllFoods } from "../controllers/foodController.js"
import { upload } from "../config/multer.js"


const router=express.Router()


router.post('/create',upload.single('image'),createFood)
router.get('/getall',getAllFoods)
router.delete('/deletefood',deleteFood)


export  default router
