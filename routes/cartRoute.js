import express from "express"
import { addToCart, clearCart, getCart, removeFromCart, updateCart } from "../controllers/cartController.js"
import { verifyUserToken } from "../middleware/verifyUserToken.js"


const router=express.Router()


router.post("/add", verifyUserToken, addToCart);


router.delete("/remove", verifyUserToken, removeFromCart);

router.get("/", verifyUserToken, getCart);


router.delete("/clear", verifyUserToken, clearCart);

router.put("/update", verifyUserToken, updateCart);

export  default router
