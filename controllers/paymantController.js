// controllers/paymentController.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Payment } from '../models/paymentSchema.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Cart } from '../models/cartSchema.js';
import { User } from '../models/userSchema.js';
import { Restaurant } from '../models/resturentSchema.js';
import { sendMail } from '../utils/sendMail.js';

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_Yh0fPwTheqXsx5',
  key_secret: 'yWdy6YEhYSQnoetu0ISm2dDV',
});

export const makePayment = asyncHandler(async (req, res) => {
  const { amount, cartId,name,address,data,resturentId,resturentName,resturentImage } = req.body;
  const userId = req.user?.id || "AnonymousUser";

console.log(resturentId);


  if (!cartId || !amount ||!name || !address) {
    return res.status(400).json({ message: 'Amount,Name,Address and Cart ID are required' });
  }

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${cartId}`,
    notes: { cartId },
  };

  const order = await razorpayInstance.orders.create(options);

  const foodId = data[0]?.foodId || null;


  
  const payment = new Payment({
    userId,
    cartId,
    foodId:foodId,
    totalCost:amount,
    name,
    address,
    data,
    email:req.user.email,
    orderId: order.id,
    resturentId:resturentId,
    resturentName:resturentName,
    resturentImage:resturentImage,
    paymentStatus: 'pending',
  });

  await payment.save();

  res.status(201).json({ order, cartId, message: "Order placed" });
});



export const verifyRazorpaySignature = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayInstance.key_secret)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentStatus: 'paid' },
      { new: true }
    );

    const userId = req.user.id;
    await Cart.findOneAndDelete({ userId });


const orderdetails=await Payment.findOne({orderId:razorpay_order_id})


const orderItems = orderdetails?.data || [];

const subject = '🎉 Your FoodOrder is Confirmed!';

const orderDetailsHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #333;">Hi ${orderdetails.name},</h2>
    <p style="font-size: 16px;">Thank you for ordering from <strong>FoodOrder</strong>! We're preparing your delicious meal 🍔🍕🍟.</p>

    <h3 style="color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px;">🧾 Order Summary:</h3>
    <ul style="list-style: none; padding: 0;">
      ${orderItems.map(item => `
        <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="font-weight: bold;">${item.name}</span> x ${item.quantity}
          <span style="float: right;">₹${(item.price * item.quantity).toFixed(2)}</span>
        </li>
      `).join('')}
    </ul>

    <h4 style="margin-top: 20px; color: #333;">Total Amount: <span style="color: #27ae60;">₹${orderdetails.totalCost.toFixed(2)}</span></h4>

    <p style="font-size: 16px; margin-top: 30px;">We will deliver your food shortly. Stay hungry, stay happy! 😋</p>

    <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #aaa;">
      <p>© 2025 FoodOrder Inc.</p>
    </div>
  </div>
`;

await sendMail(orderdetails.email, subject, 'Order placed successfully.', orderDetailsHtml);



    return res.status(200).json({
      success: true,
      message: 'Payment verified and cart cleared',
      order: updatedPayment
    });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});




export const getAllMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ userId: req.user.id });
  
  if (!payments || payments.length === 0) {
    return res.status(404).json({ message: 'No payments found for this user' });
  }

  res.status(200).json(payments);
});

export const getbyorderId = asyncHandler(async (req, res) => {
  const { orderId} = req.params;
const userId=req.user.id
console.log(orderId);

  const payments = await Payment.find({ orderId, userId });

  if (!payments || payments.length === 0) {
    return res.status(404).json({ message: 'No payments found for this order and user' });
  }

  res.status(200).json(payments);
});


export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
  .sort({ createdAt: -1 }) 
  .populate({
    path: 'data.restaurantId',
  });

  console.log(payments);
  
const amountoforder=await Payment.countDocuments()

  if (!payments || payments.length === 0) {
    return res.status(404).json({ message: 'No payments found for this user' });
  }

  const finalTotal = payments.reduce((acc, curr) => 
    acc + (curr.totalCost || 0), 0);

const totalUser=await User.countDocuments()



  res.status(200).json({payments,count:amountoforder,finalTotal,totalUser});
});


export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Check if status is valid
  const validStatuses = ['placed', 'preparing', 'on-the-way', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  // Find the order
  const payment = await Payment.findOne({ orderId });

  if (!payment) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Update the status
  payment.orderStatus = status;
  await payment.save();

  res.status(200).json({
    message: 'Order status updated successfully',
    order: payment,
  });
});


export const getForRsturent = asyncHandler(async (req, res) => {
  // const { resturentId } = req.params;
const resturentId="67f63410d7975e93fedf0f6e"
  if (!resturentId) {
    return res.status(400).json({ message: "Restaurant ID is required" });
  }

  const payments = await Payment.find({ resturentId });


  
  if (!payments || payments.length === 0) {
    return res.status(404).json({ message: "No orders found for this restaurant" });
  }

  res.status(200).json(payments);
});



export const getPaymentsByRestaurantId = asyncHandler(async (req, res) => {


  const ownerId = req.resturent?.id;

  
const gettheresturentid=await Restaurant.findOne({owner:ownerId})


const restaurantId =gettheresturentid._id

  const payments = await Payment.find({
    'data.restaurantId': restaurantId,
  });

  if (!payments || payments.length === 0) {
    return res.status(404).json({ message: "No payments found for this restaurant" });
  }

  // Debug: show what you're working with
  console.log("Original payments:", payments);

  // Filter only relevant data items
  const filteredPayments = payments.map(payment => ({
    ...payment.toObject(),
    data: payment.data.filter(item => {
      console.log("Checking item.restaurantId:", item.restaurantId);
      return item.restaurantId?.toString() === restaurantId.toString();
    }),
  }));

  res.status(200).json({ payments: filteredPayments });
});
