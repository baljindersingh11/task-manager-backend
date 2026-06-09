const express = require('express');

const router = express.Router();

const User = require('../models/User');
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        user: req.user
    });
});

router.get('/profile', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('_id name email');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
