import express from "express"
import { createReview, getallReviews, getreviewbyid } from "../controllers/reviewController.js"
import { verifyUserToken } from "../middleware/verifyUserToken.js"


const router=express.Router()


router.post('/create',verifyUserToken,createReview)
router.get('/getall',verifyUserToken,getallReviews)
router.get('/getbyid/:id',verifyUserToken,getreviewbyid)

export  default router
