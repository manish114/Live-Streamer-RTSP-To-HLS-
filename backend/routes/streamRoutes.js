const express = require('express');
const router = express.Router();
const { startStream, stopStream } = require('../controllers/streamController');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'yoursecretkey';

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

router.post('/start', verifyToken, startStream);
router.post('/stop', verifyToken, stopStream);

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;