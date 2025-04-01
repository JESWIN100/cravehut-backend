import bcrypt from "bcryptjs";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { RestOwner } from "../models/ResturentOwners.js";
import { Restaurant } from "../models/resturentSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { restaurantValidation } from "../validation/resturentValidation.js";
import { generateTokenSync } from "../utils/generateToken.js";


export const Resturentregister = asyncHandler(async (req, res) => {
  // Validate input


  const { name, email, password, confirmPassword,role } = req.body;
console.log(req.body);

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
    sucess:true,
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



export const createResturent=asyncHandler(async(req,res)=>{

    const {name,address,contactNumber,cuisineType,ratings,operatingHours,menuItems,deliveryAvaible}=req.body;

      const { error } = restaurantValidation(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details.map((err) => err.message) });
      }

      console.log( req.files);
      
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
        operatingHours,
        menuItems,
        deliveryAvaible,
        image:imageUrl
      
      })
      await newRestaurant.save()
      res.json({ status:true, msg: "Restaurant created successfully",data:newRestaurant });

})


export const getAllResturent=asyncHandler(async(req,res)=>{
    const restaurants=await Restaurant.find().select("-__v");
    res.json({ status:true, msg: "All restaurants",data:restaurants });
    
})

export const editResturent=asyncHandler(async(req,res)=>{
  const {name,address,contactNumber,cuisineType,ratings,operatingHours,menuItems
    ,deliveryAvaible}=req.body;
    const { error } = restaurantValidation(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details.map((err) => err.message) });
        }
        const restaurant=await Restaurant.findById(req.params.id);
        if(!restaurant){
          return res.status(404).json({ msg: "Restaurant not found" });
          }
          restaurant.name=name;
          restaurant.address=address;
          restaurant.contactNumber=contactNumber;
          restaurant.cuisineType=cuisineType;
          restaurant.ratings=ratings;
          restaurant.operatingHours=operatingHours;
          restaurant.menuItems=menuItems;
          restaurant.deliveryAvaible=deliveryAvaible;
          restaurant.image=req.file.path;
          await restaurant.save();
          res.json({ status:true, msg: "Restaurant updated successfully",data:restaurant });
          
})