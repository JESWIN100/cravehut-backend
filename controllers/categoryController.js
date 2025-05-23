import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Category } from "../models/categorySchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCategory=asyncHandler(async(req,res)=>{
    const {name,description}=req.body;
    if(!name||!description){
        return res.status(400).json({message:"Please fill in all fields"});
    }

   const  isexisting=await Category.findOne({name})
   if(isexisting) {
    return res.status(400).json({success:false,msg:"Category already exists"})
    }

  let imageUrl = "";
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "category_images",
      });
      imageUrl = result.secure_url;
    }



    const category=new Category({name,description,image:imageUrl,});
    await category.save();
    res.status(201).json({success:true,message:"Category created successfully"});

})

export const getallCategory=asyncHandler(async(req,res)=>{
  const categories=await Category.find()
  res.status(200).json({success:true,message:"Categories fetched successfully",categories})
})


export const deleteCategory=asyncHandler(async(req,res)=>{
  const {id}=req.params
  const categories=await Category.findById(id)
  if(!categories){
    return res.status(404).json({ msg: "Category not found" });
    }
    await categories.deleteOne({ _id: categories });
  res.status(200).json({success:true,message:"Categories fetched successfully",categories})
})



export const editCategrory= asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    name,description
  } = req.body;

  console.log(req.body);
  

  let updatedFields = {
    name,description
  };

  // Only update the image if a new file is uploaded
  if (req.file) {
    const result = await cloudinaryInstance.uploader.upload(req.file.path, {
      folder: "category_images",
    });
    updatedFields.image = result.secure_url;
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updatedFields, {
    new: true,
  });

  res.status(200).json({
    status: true,
    msg: "Category item updated successfully",
    food: updatedCategory,
  });
});