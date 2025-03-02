const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const USER = require('../models/User');

router.post("/userAuth", async (req, res) => {
    const { name, email, password, userType } = req.body;
    try {
        if (await USER.findOne({ email })) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new USER({ name, email, password: hashedPassword, userType });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await USER.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(404).json({ error: "Invalid credentials" });
        }
        req.session.user = {
            userId: user._id,
            userEmail: user.email,
            userType: user.userType,
            userName: user.name,
        };
        console.log("User session set:", req.session);
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/user", async (req, res) => {
    try {
        if (!req.session.user) return res.status(401).json({ error: "User not authenticated" });
        const user = await USER.findById(req.session.user.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ userName: user.name, userId: user._id, userEmail: user.email, userType: user.userType });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;