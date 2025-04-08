import express from "express"
import { verifyUserToken } from "../middleware/verifyUserToken.js"
import { deleteUser, editProfile, getUser, login, logout, register } from "../controllers/userController.js"
import { searchFood } from "../controllers/foodController.js"


const router=express.Router()


router.post('/create',register)
router.post('/login',login)

router.get('/profile',verifyUserToken,getUser)
router.put('/edit-profile',verifyUserToken,editProfile)
router.delete('/delete-profile',verifyUserToken,deleteUser)
router.post('/logout',verifyUserToken,logout)


router.get('/search',searchFood)


export  default router
