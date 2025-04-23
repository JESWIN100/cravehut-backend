import express from "express"
import {  getAllMyPayments, getbyorderId, getForRsturent, getPaymentsByRestaurantId, makePayment, updateOrderStatus, verifyRazorpaySignature } from "../controllers/paymantController.js"

import { verifyUserToken } from "../middleware/verifyUserToken.js"

const router=express.Router()

router.post("/create-order",verifyUserToken,makePayment)
router.post('/verify',verifyUserToken, verifyRazorpaySignature);
router.get('/get',verifyUserToken, getAllMyPayments);
router.get('/getby/:orderId',verifyUserToken, getbyorderId);
router.put('/status/:orderId',verifyUserToken, updateOrderStatus);

router.get('/getrest', getForRsturent);





export  default router
