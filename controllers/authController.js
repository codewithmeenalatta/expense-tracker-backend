import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User Already Exists" });

        await User.create({ name, email, password });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!", error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" }); // Premium tip: Don't tell hackers if the email exists or not

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Create the token 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Send token in cookie securely
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ 
            message: "Logged in successfully", 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!", error: error.message });
    }
};

// Logout
export const logout = async (req, res) => {
    // FIXED: Match cookie options to ensure the browser successfully deletes it
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    res.status(200).json({ message: "Logged Out Successfully" });
};

// new feature update your budget
export const updateBudget  = async (req , res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({ message : "User Not Found"});
        }
        // update their budget with the new number from the frontend
        user.monthlyBudget = req.body.monthlyBudget;
        await user.save();
        res.status(200).json({ monthlyBudget: user.monthlyBudget  , message :"Budget Update Sucessfully"})
    } catch (error) {
        console.error("Budget Update Error:"  , error);
        res.status(500).json({ message : "Failed to update budget"})
    }
}