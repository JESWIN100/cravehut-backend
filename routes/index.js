import express from "express";
import userRoute from './userRoute.js'
import foodRoute from './foodRoute.js'
import adminRoute from './adminRoute.js'
import resturentRoute from './resturentRoute.js'
import cartRoute from './cartRoute.js'
import reviewRoute from './reviewRoute.js'
const v1Router=express.Router()


v1Router.use('/user',userRoute)
v1Router.use('/food',foodRoute)
v1Router.use('/admin',adminRoute)
v1Router.use('/resturent',resturentRoute)
v1Router.use('/cart',cartRoute)
v1Router.use('/review',reviewRoute)
export default v1Router



