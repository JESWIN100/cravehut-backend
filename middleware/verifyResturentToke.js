import jwt from 'jsonwebtoken';

export const verifyResturentToken = (req, res, next) => {
  const token = req.cookies.Resturenttoken || req.headers['authorization']?.replace(/^Bearer\s/, '');

  if (!token) {
    return res.status(403).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure role exists
    if (!verified.role) {
      return res.status(403).json({ success: false, message: 'Access denied. No role found in token.' });
    }

    req.resturent = verified;
    // console.log(req.resturent);
    
    next();
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid token' });
  }
};
