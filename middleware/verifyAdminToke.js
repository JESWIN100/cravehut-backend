import jwt from 'jsonwebtoken';


export const verifyAdminToken = (req, res, next) => {
  
  const token = req.cookies.AdminToken || req.headers['authorization']?.replace(/^Bearer\s/, '');


  if (!token) {
    return res.status(403).json({ success: false, message: 'Access denied. No token provided.' });
  }
 
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;

    
    next();
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid token' });
  }
};