import { asyncHandler } from "../utils/asyncHandle.js";

export const makeaorder=asyncHandler(async(req,res)=>{

    const{resturentId,orderStatus,TotalAmount,paymentStatus}=req.body
})