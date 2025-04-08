import { Admin } from "../models/adminSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { generateAdminTokenSync } from "../utils/generateToken.js";

// Create Admin
export const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    console.log(req.body);
    
    // if(!name, email, password){
    //     return res.status(400).json({ message: "Please fill in all fields" });
    // }
    
    const isExist = await Admin.findOne({ email });
    if (isExist) {
        return res.status(400).json({ success: false, message: "Admin already exists with this email" });
    }

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ success: true, message: "Admin created successfully" });
});

// Login Admin
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(400).json({ success: false, message: "Admin not found with this email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = generateAdminTokenSync(admin._id);
    res.cookie("AdminToken", token, { httpOnly: true, sameSite: "None", secure: true });

    res.status(200).json({ success: true, message: "Admin logged in successfully", token });
});

// Get Admin Profile
export const getAdminProfile = asyncHandler(async (req, res) => {

    
    const admin = await Admin.findById(req.admin.id).select("-password"); // Exclude password
    if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, admin });
});

// Update Admin Profile
export const updateAdminProfile = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    if (req.body.password) {
        admin.password = await bcrypt.hash(req.body.password, 10);
    }

    await admin.save();
    res.status(200).json({ success: true, message: "Admin profile updated successfully" });
});
   
// Delete Admin
export const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
    }

    await admin.deleteOne();
    res.status(200).json({ success: true, message: "Admin deleted successfully" });
});


export const checkAdmin=asyncHandler(async(req,res,next)=>{
  

          const user=req.admin;
          console.log(user);
          
          if(!user){
              return res.status(401).json({success:false,message:'Admin not authenticated'})
              }
          
        res.json({success:true,message:'Admin is authenticated'})
      
      
          } )


// Logout Admin
export const logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("AdminToken", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });

    res.status(200).json({ success: true, message: "Admin logged out successfully" });
});
