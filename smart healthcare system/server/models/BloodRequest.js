const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    bloodType: { type: String, required: true },
    quantity: { type: Number, required: true },
    patientName: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    priority: { type: String, default: 'Normal' },
    requestedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);