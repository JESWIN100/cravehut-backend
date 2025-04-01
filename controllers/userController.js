import { User } from "../models/userSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateTokenSync } from "../utils/generateToken.js";
import { registerValidation } from "../validation/userJoiValidation.js";
import bcrypt from "bcryptjs";


export const register = asyncHandler(async (req, res) => {
  // Validate input
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details.map((err) => err.message) });
  }

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
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: `${existingUser.role} already exists `});
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  await newUser.save()
  if (!newUser) {
    return res.status(500).json({ msg: "Something went wrong. Try again later." });
  }

  
  const token=generateTokenSync(newUser._id,role)
  
  res.cookie('Usertoken', token, { httpOnly: true,  sameSite: 'None',
    secure: true });


  res.status(201).json({
    sucess:true,
    msg: "User registered successfully",
   data:newUser,
   tokem:token,
   role
  });
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg:`${user.role} Not found` });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = generateTokenSync(user._id, user.role);

  res.cookie('Usertoken', token, { httpOnly: true, sameSite: 'None', secure: true });

  res.status(200).json({
    success: true,
    msg: "Logged in successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: token,
  });
});


        export const editProfile=asyncHandler(async(req,res)=>{
          const {name,email}=req.body;

          const user=await User.findById(req.user.id);
      
          

          if(!user) return res.status(404).json({msg:"User not found"});

          const updateProduct=await User.findByIdAndUpdate(
            user,
            req.body,
            { new:true, runValidators:true}
        )
        res.status(200).json({sucess:true,msg:"Product updated successfully",product:updateProduct });
        

        })

        export const getUser = asyncHandler(async (req, res, next) => {
          const user = req.user;
          const userDetails = await User.findById(user.id).select('-password');
      
          
          res.status(200).json({
            success: true,
            userDetails,
          });
        });
        



export const deleteUser=asyncHandler(asyncHandler(async(req,res)=>{
  const id=req.user.id;

  if(!id) return res.status(404).json({msg:"User not found"});

  const user=await User.findByIdAndDelete(id);
  
  res.status(200).json({sucess:true,msg:"User deleted successfully"});

}))


        export const logout = asyncHandler(async (req, res) => {
          if(!req.user.id){
            return res.status(401).json({msg:"User not found"})
          }
          res.cookie("Usertoken", "", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            expires: new Date(0), 
          });
        
          res.status(200).json({ success: true, msg: "Logged out successfully" });
        });
        