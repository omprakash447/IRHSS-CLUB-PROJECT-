const express = require('express');
const router = express.Router();
const Accident = require('../models/Accident');

router.post('/', async (req, res) => {
    const { location, description, city, state } = req.body;
    try {
        const newAccident = new Accident({ location, description, city, state });
        await newAccident.save();
        res.status(201).json(newAccident);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving accident' });
    }
});

router.get('/', async (_req, res) => {
    try {
        const accidents = await Accident.find();
        res.json({ accidents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching accidents' });
    }
});

router.put('/:id', async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status || (status !== 'Pending' && status !== 'Checkout')) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const accident = await Accident.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!accident) {
            return res.status(404).json({ error: 'Accident not found' });
        }
        res.status(200).json(accident);
    } catch (err) {
        console.error('Error updating accident:', err);
        res.status(500).json({ error: 'Failed to update the accident' });
    }
});

module.exports = router;