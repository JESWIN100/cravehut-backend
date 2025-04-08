import express from "express"
import { checkAdmin, createAdmin, getAdminProfile, loginAdmin, logoutAdmin } from "../controllers/adminController.js"
import { verifyAdminToken } from "../middleware/verifyAdminToke.js"
import { getAllResturent } from "../controllers/resturentController.js"
import { getAllFoods } from "../controllers/foodController.js"



const router=express.Router()


router.post('/create',createAdmin)
router.post('/login',loginAdmin)

router.get('/admin-profile',verifyAdminToken,getAdminProfile)
router.post("/logout", logoutAdmin);
router.get("/check-admin",verifyAdminToken,checkAdmin)


router.get('/Admingetall',verifyAdminToken,getAllFoods)
router.get('/AdminResturantgetall',verifyAdminToken,getAllResturent)



export  default router
