import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    console.log('Registration attempt with data:', req.body); // Log incoming data
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword, role });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error); // Log the full error
        res.status(500).json({ message: 'Server error' });
    }
});


// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt with email:', email); // Log email

    try {
        const user = await User.findOne({ email });
        console.log('User found:', user); // Log the user data
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isPasswordCorrect); // Log comparison result
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error); // Log error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
