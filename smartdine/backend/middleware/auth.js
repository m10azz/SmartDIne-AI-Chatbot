const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token usually comes as "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    
    // Attach user payload to request
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  // For this iteration, we assume the user payload has an isAdmin flag or email matching an admin email.
  // We'll check if the token payload has { isAdmin: true } or email 'admin@smartdine.com'
  if (req.user && (req.user.isAdmin || req.user.email === 'admin@smartdine.com')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { authenticateToken, isAdmin };
