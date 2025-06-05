const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
    req.user = {
      id: decoded.userId, 
      role: decoded.role
    };

    console.log("Authenticated user from token:", req.user);

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = protect;
