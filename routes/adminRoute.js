import express from "express"
import { checkAdmin, createAdmin, getAdminProfile, loginAdmin, logoutAdmin } from "../controllers/adminController.js"
import { verifyAdminToken } from "../middleware/verifyAdminToke.js"
import { deleteResturent, getAllResturent } from "../controllers/resturentController.js"
import { deleteFood, getAllFoods } from "../controllers/foodController.js"
import { createCategory, deleteCategory, editCategrory, getallCategory } from "../controllers/categoryController.js"
import { upload } from "../config/multer.js"
import { getAllPayments } from "../controllers/paymantController.js"



const router=express.Router()


router.post('/create',createAdmin)
router.post('/login',loginAdmin)

router.get('/admin-profile',verifyAdminToken,getAdminProfile)
router.post("/logout", logoutAdmin);
router.get("/check-admin",verifyAdminToken,checkAdmin)


router.get('/Admingetall',verifyAdminToken,getAllFoods)
router.get('/AdminResturantgetall',verifyAdminToken,getAllResturent)
router.delete('/delete-resturent/:id',verifyAdminToken,deleteResturent)

router.post('/createCategory',verifyAdminToken,upload.single('image'),createCategory)
router.get('/getallcategory',verifyAdminToken,getallCategory)
router.put('/update-category/:id',upload.single('image'),verifyAdminToken,editCategrory)
router.delete('/delete-Category/:id',verifyAdminToken,deleteCategory)


router.get('/getall', getAllPayments);

router.delete('/deletefood/:id',verifyAdminToken,deleteFood)





export  default router
