const mongoose = require('mongoose');

const accidentSchema = new mongoose.Schema({
    location: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['Pending', 'Checkout'], default: 'Pending' },
    time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Accident', accidentSchema);