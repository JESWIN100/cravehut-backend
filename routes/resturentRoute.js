import express from "express"
import { checkOwnerHasRestaurant, checkRestutant, createResturent, deleteResturent, editRestaurant, getAllResturent, getRestaurantById, getResturant, logoutResturent, RestaurantByIds, Resturentlogin, Resturentregister } from "../controllers/resturentController.js"
import { upload } from "../config/multer.js"
import { verifyResturentToken } from "../middleware/verifyResturentToke.js"
import { editFood, getfoodbyid, getFoodsByRestaurantId } from "../controllers/foodController.js"
import { getallCategory } from "../controllers/categoryController.js"
import { getPaymentsByRestaurantId, updateOrderStatus } from "../controllers/paymantController.js"



const router=express.Router()

router.post("/register",Resturentregister)
router.post("/login",Resturentlogin)
router.get("/getprofile",verifyResturentToken,getResturant)
router.post("/logout",verifyResturentToken,logoutResturent)

router.get("/check/hasrestaurant", verifyResturentToken, checkOwnerHasRestaurant);
router.get("/check-resturant",verifyResturentToken,checkRestutant)

router.post('/create',verifyResturentToken,upload.single('image'),createResturent)
router.get('/getall',getAllResturent)
router.get('/getallbyid',verifyResturentToken,getRestaurantById)
router.get('/getresturantfood/:id',getFoodsByRestaurantId)
router.put('/edit-resturent/:id',verifyResturentToken,editRestaurant)
router.delete('/delete-resturent/:id',verifyResturentToken,deleteResturent)

router.get('/getid/:id',RestaurantByIds)


router.get('/getallcategory',verifyResturentToken,getallCategory)



router.get('/orders',verifyResturentToken, getPaymentsByRestaurantId);
router.put('/status/:orderId',verifyResturentToken, updateOrderStatus);


router.get('/food-getbyid/:id',verifyResturentToken,getfoodbyid)
router.put('/edit-food/:id',upload.single('image'),editFood)


export  default router
