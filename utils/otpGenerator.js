const otpStore = new Map(); // You can use Redis or DB for production

export const generateOtp = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
};

export const saveOtp = async (email, otp) => {
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
};

export const verifyOtpAndDelete = async (email, inputOtp) => {
  const record = otpStore.get(email);
  if (!record || record.otp !== inputOtp || Date.now() > record.expires) {
    return false;
  }
  otpStore.delete(email);
  return true;
};
