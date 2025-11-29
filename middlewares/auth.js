const jwt = require('jsonwebtoken');


module.exports = function (requiredRole = null) {
return function (req, res, next) {
const token = req.header('Authorization')?.replace('Bearer ', '');
if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // contains id and role
if (requiredRole && req.user.role !== requiredRole) {
return res.status(403).json({ msg: 'Forbidden: insufficient role' });
}
next();
} catch (err) {
return res.status(401).json({ msg: 'Token is not valid' });
}
};
};