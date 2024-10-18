const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded; // Attach decoded token data (usually user ID) to request object
        next(); // Move to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid or expired' });
    }
};

module.exports = authMiddleware;
