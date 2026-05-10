const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save to database
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const login = async (req, res) => {

    try {

        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {
    signup,
    login
};
