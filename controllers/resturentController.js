import bcrypt from "bcryptjs";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
// import { RestOwner } from "../models/ResturentOwners.js";
import { Restaurant } from "../models/resturentSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { restaurantValidation } from "../validation/resturentValidation.js";
import { generateTokenSync } from "../utils/generateToken.js";
import { RestOwner } from "../models/RestaurantOwners.js"; // ✅ Correct spelling

export const Resturentregister = asyncHandler(async (req, res) => {
  // Validate input


  const { name, email, password, confirmPassword,role } = req.body;


  // Check for empty fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: "Please fill in all fields" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  // Check if user already exists
  const existingresturent = await RestOwner.findOne({ email });
  if (existingresturent) {
    return res.status(400).json({ msg: `${existingresturent.role} already exists `});
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create resturent
  const newresturent = await RestOwner.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  await newresturent.save()
  if (!newresturent) {
    return res.status(500).json({ msg: "Something went wrong. Try again later." });
  }

  
  const token=generateTokenSync(newresturent._id,role)
  
  res.cookie('Resturenttoken', token, { httpOnly: true,  sameSite: 'None',
    secure: true });


  res.status(201).json({
    success:true,
    msg: "User registered successfully",
   data:newresturent,
   tokem:token,
   role
  });
});


export const Resturentlogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const resturent = await RestOwner.findOne({ email });

  if (!resturent) return res.status(400).json({ msg:`${resturent.role} Not found` });

  const isMatch = await bcrypt.compare(password, resturent.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = generateTokenSync(resturent._id, resturent.role);

  res.cookie('Resturenttoken', token, { httpOnly: true, sameSite: 'None', secure: true });

  res.status(200).json({
    success: true,
    msg: "Logged in successfully",
    data: {
      id: resturent._id,
      name: resturent.name,
      email: resturent.email,
      role: resturent.role,
    },
    token: token,
  });
});


        export const getResturant = asyncHandler(async (req, res, next) => {
          const user = req.resturent.id;
          const userDetails = await Restaurant.findById(user.id).select('-password');
      
          log
          res.status(200).json({
            success: true,
            userDetails,
          });
        });


export const logoutResturent = asyncHandler(async (req, res) => {
    res.clearCookie("Resturenttoken", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });

    res.status(200).json({ success: true, message: "Admin logged out successfully" });
});


      
        export const checkOwnerHasRestaurant = asyncHandler(async (req, res) => {
          const ownerId = req.resturent.id;
        
          const restaurant = await Restaurant.findOne({ owner: ownerId });
        
          if (!restaurant) {
            return res.status(200).json({
              hasRestaurant: false,
              msg: "No restaurant found. Please create one.",
            });
          }
        
          res.status(200).json({
            hasRestaurant: true,
            restaurant,
          });
        });
        



        export const checkRestutant=asyncHandler(async(req,res,next)=>{
  

          const user=req.resturent;
          // console.log(user);
          
          if(!user){
              return res.status(401).json({success:false,message:'Resturant not authenticated'})
              }
          
        res.json({success:true,message:'Resturant is authenticated'})
      
      
          } )


export const createResturent=asyncHandler(async(req,res)=>{

    const {name,address,contactNumber,cuisineType,ratings,category,offers}=req.body;
// console.log(req.body);

      const { error } = restaurantValidation(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details.map((err) => err.message) });
      }

      const existingRestaurant = await Restaurant.findOne({ owner: req.resturent.id });
  if (existingRestaurant) {
    return res.status(400).json({ sucess:false,msg: "You have already created a restaurant." });
  }
      
      let imageUrl = "";
      if ( req.file) {  // Ensure req.file exists
        const result = await cloudinaryInstance.uploader.upload(req.file.path, {
          folder: "resturent_images",
        });
        imageUrl = result.secure_url;
      }
      

      const newRestaurant=new Restaurant({
        name,
        address,
        contactNumber,
        cuisineType,
        ratings,
        category,
        offers,
        image:imageUrl,
        owner:req.resturent.id
      
      })
      
      await newRestaurant.save()
      res.json({ status:true, msg: "Restaurant created successfully",data:newRestaurant });

})


export const getAllResturent=asyncHandler(async(req,res)=>{
    const restaurants=await Restaurant.find().select("-__v").populate("owner");
    res.json({ status:true, msg: "All restaurants",data:restaurants });
    
})

export const getRestaurantById = asyncHandler(async (req, res) => {
  const ownerId = req.resturent?.id;

  if (!ownerId) {
    return res.status(401).json({ status: false, msg: "Unauthorized: owner ID not found" });
  }

  const restaurant = await Restaurant.findOne({ owner: ownerId }).select("-__v");

  if (!restaurant) {
    return res.status(404).json({ status: false, msg: "No restaurant found for this owner" });
  }

  res.status(200).json({ status: true, msg: "Restaurant fetched successfully", data: restaurant });
});

export const RestaurantByIds = asyncHandler(async (req, res) => {
  const id = req.params?.id;

  if (!id) {
    return res.status(401).json({ status: false, msg: "Unauthorized: owner ID not found" });
  }

  const restaurant = await Restaurant.findById(id).select("-__v");

  if (!restaurant) {
    return res.status(404).json({ status: false, msg: "No restaurant found for this owner" });
  }

  res.status(200).json({ status: true, msg: "Restaurant fetched successfully", data: restaurant });
});



export const editRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address, contactNumber, cuisineType, ratings, operatingHours, menuItems, deliveryAvailable } = req.body;


  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return res.status(404).json({ status: false, msg: "Restaurant not found" });
  }

  let imageUrl = restaurant.image;
  if (req.file) {
    const result = await cloudinaryInstance.uploader.upload(req.file.path, { folder: "resturent_images" });
    imageUrl = result.secure_url;
  }

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, {
    name, address, contactNumber, cuisineType, ratings, operatingHours, menuItems, deliveryAvailable, image: imageUrl
  }, { new: true });

  res.status(200).json({ status: true, msg: "Restaurant updated successfully", data: updatedRestaurant });
});


export const deleteResturent=asyncHandler(async(req,res)=>{
  const {id}=req.params; 
  const restaurant=await Restaurant.findById(id);
  if(!restaurant){
    return res.status(404).json({ msg: "Restaurant not found" });
    }
    await restaurant.deleteOne({ _id: restaurant });
    res.json({ status:true, msg: "Restaurant deleted successfully" });
    
})