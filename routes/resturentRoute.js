import express from "express"
import { createResturent, getAllResturent, Resturentlogin, Resturentregister } from "../controllers/resturentController.js"
import { upload } from "../config/multer.js"
import { verifyResturentToken } from "../middleware/verifyResturentToke.js"



const router=express.Router()

router.post("/register",Resturentregister)
router.post("/login",Resturentlogin)

router.post('/create',verifyResturentToken,upload.single('image'),createResturent)
router.get('/getall',verifyResturentToken,getAllResturent)


export  default router
