const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || "mongodb+srv://supriyadhal50:n6Ef2fti2ezb99f0@cluster0.pgn4a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/SHC"
        );
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;