import express from "express"
import { createReview } from "../controllers/reviewController.js"
import { verifyUserToken } from "../middleware/verifyUserToken.js"


const router=express.Router()


router.post('/create',verifyUserToken,createReview)

export  default router
