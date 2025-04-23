import express from "express"
import { verifyUserToken } from "../middleware/verifyUserToken.js"
import { deleteUser, editProfile, getUser, login, logout, register, verifyOtp } from "../controllers/userController.js"
import { searchFood } from "../controllers/foodController.js"
import { getAllCartTotal } from "../controllers/cartController.js"
import { getallCategory } from "../controllers/categoryController.js"


const router=express.Router()


router.post('/create',register)
router.post('/login',login)
router.post('/login/verify-otp', verifyOtp);

router.get('/profile',verifyUserToken,getUser)
router.put('/edit-profile',verifyUserToken,editProfile)
router.delete('/delete-profile',verifyUserToken,deleteUser)
router.post('/logout',verifyUserToken,logout)


router.get('/search',searchFood)
router.get('/total',verifyUserToken,getAllCartTotal)

router.get('/getallcategory',getallCategory)
export  default router
