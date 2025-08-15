const User = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { userName, gmail, password } = req.body;

        if (!userName || !gmail || !password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const existingUser = await User.findOne({ gmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await User.create({
            userName,
            gmail,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, userName: newUser.userName, gmail: newUser.gmail },
            token
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { gmail, password } = req.body;

        if (!gmail || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ gmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.userName,
                gmail: user.gmail,
                bio: user.bio || "",
                avatar: user.avatar || "" 
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





module.exports = {registerUser,loginUser}
