const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');


const router = express.Router();


// Register - POST /api/auth/register
router.post('/register', async (req, res) => {
try {
const { name, email, password, role } = req.body;
if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });


let user = await User.findOne({ email });
if (user) return res.status(400).json({ msg: 'User already exists' });


const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);


user = new User({ name, email, password: hashed, role: role || 'user' });
await user.save();


const payload = { id: user.id, role: user.role };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });


res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
});


// Login - POST /api/auth/login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });


const user = await User.findOne({ email });
if (!user) return res.status(400).json({ msg: 'Invalid credentials' });


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });


const payload = { id: user.id, role: user.role };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });


res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
});


// Protected example route - GET /api/auth/me
router.get('/me', authMiddleware(), async (req, res) => {
try {
const user = await User.findById(req.user.id).select('-password');
res.json(user);
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
});


module.exports = router;