const mongoose = require('mongoose');

const BloodSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true, 
        enum: ["Donate", "Request", "RequestCheck"]
    },
    bloodType: { 
        type: String, 
        required: true, 
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] 
    },
    quantity: { type: Number, required: true },
    location: { 
        type: String, 
        required: function() { 
            return this.type === "Donate" || this.type === "Request";
        } 
    },
    name: { 
        type: String, 
        required: function() { 
            return this.type === "Donate" || this.type === "Request";
        } 
    },
    contact: { 
        type: String, 
        required: function() { 
            return this.type === "Donate" || this.type === "Request";
        } 
    },
    priority: { 
        type: String, 
        enum: ["Low", "Medium", "High"], 
        default: null 
    },
    createdAt: { type: Date, default: Date.now },
    available: { 
        type: Boolean, 
        required: function() { 
            return this.type === "RequestCheck";
        },
        default: null 
    },
    checkedAt: { 
        type: Date, 
        required: function() { 
            return this.type === "RequestCheck";
        },
        default: null 
    },
});

module.exports = mongoose.model("Blood", BloodSchema);