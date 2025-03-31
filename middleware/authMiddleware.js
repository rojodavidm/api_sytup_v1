const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
const token = req.header('Authorization');
const TOKEN_CLIENT = process.env.URL_BASE;
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token,TOKEN_CLIENT );
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;