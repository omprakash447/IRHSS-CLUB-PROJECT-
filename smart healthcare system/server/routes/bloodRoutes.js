const express = require('express');
const router = express.Router();
const Blood = require('../models/Blood');
const BloodRequest = require('../models/BloodRequest');

router.post("/donate", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { bloodType, quantity, location, name, contact } = req.body;
        const donationData = {
            bloodType, quantity, location,
            name: name || req.session.user.userName,
            contact: contact || req.session.user.userEmail,
        };
        const newDonation = new Blood({ type: "Donate", ...donationData });
        await newDonation.save();
        res.status(201).json({ message: "Donation recorded successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/request', async (req, res) => {
    try {
        const { bloodType, quantity, name, contact, priority } = req.body;
        if (!bloodType || !quantity || !name || !contact) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newRequest = new Blood({ type: 'Request', bloodType, quantity, name, contact, priority });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/request-blood', async (req, res) => {
    try {
        const { bloodType, quantity, patientName, location, contact, priority } = req.body;
        const newRequest = new BloodRequest({ bloodType, quantity, patientName, location, contact, priority });
        await newRequest.save();
        res.status(201).json({ message: 'Blood request created successfully', newRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the blood request' });
    }
});

router.get('/donations', async (_req, res) => {
    try {
        const donations = await Blood.find({ type: "Donate" });
        res.status(200).json(donations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/requests', async (_req, res) => {
    try {
        const requests = await Blood.find({ type: "Request" });
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/request-blood', async (_req, res) => {
    try {
        const requests = await BloodRequest.find();
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching blood requests' });
    }
});

router.patch('/mark-request-accessed/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRequest = await BloodRequest.findByIdAndUpdate(
            id,
            { status: 'Accessed' },
            { new: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/match', async (_req, res) => {
    try {
        const matches = await Blood.aggregate([
            { $match: { type: "Request" } },
            {
                $lookup: {
                    from: "bloods",
                    let: { requestBloodType: "$bloodType", requestLocation: "$location" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$type", "Donate"] },
                                        { $eq: ["$bloodType", "$$requestBloodType"] },
                                        { $eq: ["$location", "$$requestLocation"] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "matches",
                },
            },
        ]);
        res.status(200).json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/request/check-availability", async (req, res) => {
    try {
        const { bloodType, quantity } = req.body;
        if (!bloodType || !quantity) {
            return res.status(400).json({ error: "Blood type and quantity are required" });
        }
        const availableDonations = await Blood.aggregate([
            { $match: { type: "Donate", bloodType: bloodType } },
            { $group: { _id: "$bloodType", totalQuantity: { $sum: "$quantity" } } },
        ]);
        const isAvailable = availableDonations.length > 0 && availableDonations[0].totalQuantity >= quantity;
        const checkRequest = new Blood({
            type: "RequestCheck",
            bloodType,
            quantity,
            checkedAt: new Date(),
            available: isAvailable,
        });
        await checkRequest.save();
        res.status(200).json({ 
            available: isAvailable, 
            message: isAvailable ? "Sufficient blood available" : "Insufficient blood available" 
        });
    } catch (err) {
        console.error("Error while checking availability:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/request/check-availability", async (req, res) => {
    try {
        const { bloodType } = req.query;
        if (!bloodType) {
            return res.status(400).json({ error: "Blood type is required" });
        }
        const checks = await Blood.find({ type: "RequestCheck", bloodType });
        if (checks.length === 0) {
            return res.status(404).json({ message: "No check records found for the specified blood type" });
        }
        res.status(200).json(checks);
    } catch (err) {
        console.error("Error while fetching check availability:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;