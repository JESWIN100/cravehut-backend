import express from "express"
import { checkOwnerHasRestaurant, checkRestutant, createResturent, deleteResturent, editRestaurant, getAllResturent, getRestaurantById, getResturant, Resturentlogin, Resturentregister } from "../controllers/resturentController.js"
import { upload } from "../config/multer.js"
import { verifyResturentToken } from "../middleware/verifyResturentToke.js"
import { getFoodsByRestaurantId } from "../controllers/foodController.js"



const router=express.Router()

router.post("/register",Resturentregister)
router.post("/login",Resturentlogin)
router.get("/getprofile",verifyResturentToken,getResturant)

router.get("/check/hasrestaurant", verifyResturentToken, checkOwnerHasRestaurant);
router.get("/check-resturant",verifyResturentToken,checkRestutant)

router.post('/create',verifyResturentToken,upload.single('image'),createResturent)
router.get('/getall',getAllResturent)
router.get('/getallbyid',verifyResturentToken,getRestaurantById)
router.get('/getresturantfood/:id',getFoodsByRestaurantId)
router.put('/edit-resturent/:id',verifyResturentToken,editRestaurant)
router.delete('/delete-resturent/:id',verifyResturentToken,deleteResturent)

export  default router
