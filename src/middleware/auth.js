const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null;

        const token = req.cookies?.token || bearerToken;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: token missing' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: invalid token' });
    }
};

module.exports = auth;
