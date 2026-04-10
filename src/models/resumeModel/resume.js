const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
            trim: true
        },
        fileUrl: {
            type: String,
            required: true,
            trim: true
        },
        fileId: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
