const mongoose = require('mongoose')

const heroSchema = new mongoose.Schema({    
    description: { type: String, },
    status: { type: String, },
}, { timestamps: true });

const Hero = mongoose.model('Hero', heroSchema)

module.exports = Hero;   