import express from "express"
import { createAdmin, getAdminProfile, loginAdmin } from "../controllers/adminController.js"
import { verifyAdminToken } from "../middleware/verifyAdminToke.js"



const router=express.Router()


router.post('/create',createAdmin)
router.post('/login',loginAdmin)

router.get('/admin-profile',verifyAdminToken,getAdminProfile)

export  default router
