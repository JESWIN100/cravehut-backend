import express from "express"
import { upload } from "../config/multer.js"
import { createCategory } from "../controllers/categoryController.js"


const router=express.Router()


router.post('/create',upload.single('image'),createCategory)

export  default router
