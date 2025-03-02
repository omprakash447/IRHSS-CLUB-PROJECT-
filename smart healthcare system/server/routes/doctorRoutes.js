const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const DOCTOR = require('../models/Doctor');

router.post("/doctor-registration", async (req, res) => {
    try {
        const {
            name, email, password, specialization, contact, experience, currentHospital, address
        } = req.body;

        if (!name || !email || !password || !specialization || !contact || !experience || !currentHospital || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (await DOCTOR.findOne({ email })) {
            return res.status(400).json({ message: "Doctor already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new DOCTOR({
            name, email, password: hashedPassword, specialization, contact, experience,
            currenthospital: currentHospital, address
        });

        await newDoctor.save();
        res.status(201).json({ message: "Doctor registered successfully" });
    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/doctor-login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const doctor = await DOCTOR.findOne({ email });
        if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
            return res.status(404).json({ error: "Invalid credentials" });
        }
        req.session.doctor = {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization,
        };
        res.status(200).json({ message: "Login successful", doctor: req.session.doctor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/doctor-profile", async (req, res) => {
    try {
        if (!req.session.doctor) {
            return res.status(401).json({ error: "Not authorized" });
        }
        const doctor = await DOCTOR.findById(req.session.doctor.id);
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json({
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization,
            contact: doctor.contact,
            experience: doctor.experience,
            currentHospital: doctor.currenthospital,
            address: doctor.address,
        });
    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;