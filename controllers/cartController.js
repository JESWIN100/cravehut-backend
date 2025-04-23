
import { Cart } from "../models/cartSchema.js";
import { Food } from "../models/foodSchema.js";
import { Restaurant } from "../models/resturentSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// 📌 Add item to cart
// backend/controllers/cartController.js
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, restaurantId } = req.body;
  const userId = req.user.id;

  const product = await Food.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // Create a new cart
    cart = new Cart({
      userId,
      items: [],
      totalPrice: 0
    });
  } else if (
    cart.items.length > 0 &&
    cart.items[0].restaurantId.toString() !== restaurantId
  ) {
    // If restaurant ID doesn't match, reset the cart
    cart.items = [];
    cart.totalPrice = 0;
  }

  // Check if product is already in the cart
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price || 0,
      image: product.image,
      quantity: Number(quantity),
      foodId: productId,
      restaurantId 
    });
  }

  // Recalculate total price
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
});




// 📌 Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.query.productId;
    console.log(productId);
    
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
});

// 📌 Get cart items
export const getCart = asyncHandler(async (req, res) => {
    const  userId  =req.user.id;
   const cart = await Cart.findOne({ userId });


    if (!cart) return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json(cart);
});

// 📌 Clear cart
export const clearCart = asyncHandler(async (req, res) => {
    const  userId  = req.user.id;
    await Cart.findOneAndDelete({ userId })
    res.status(200).json({ message: "Cart cleared" });
});

export const updateCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than zero" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not found in cart" });

    item.quantity = Number(quantity);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json({ success: true, message: "Cart updated successfully", cart });
});


export const getAllCartTotal=asyncHandler(async(req,res)=>{
  
  
  const products=await Cart.countDocuments()
  if(!products){
      return res.status(404).json({message:"No Carts found"})
      }
      res.status(200).json({success: true, message: 'Carts list fetched', data: products})
})
