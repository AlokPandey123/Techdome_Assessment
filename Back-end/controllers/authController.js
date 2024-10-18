const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        // Create a new user with the provided data
        const user = new User({ name, email, mobile, password });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle duplicate key errors for username, email, and mobile
        if (error.code === 11000) {
            return res.status(400).json({ error: 'email, or mobile number already exists.' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // Compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Create the JWT token with the user ID
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Return both the token and the user ID
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

