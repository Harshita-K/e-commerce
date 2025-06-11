import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js';

const requireAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.json({ success: false, message: 'Authorization token required' });
  }

  // Format: "Bearer TOKEN_STRING"
  const token = authorization.split(' ')[1];

  try {
    // Verify token
    const { ID } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user ID to request
    req.user = { ID };
    next();
    
  } catch (error) {
    console.log('JWT verification error:', error);
    res.json({ success: false, message: 'Request not authorized' });
  }
};

export default requireAuth;