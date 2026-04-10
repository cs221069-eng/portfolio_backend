const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        shortDescription: {
            type: String,
            required: true,
            trim: true
        },
        details: {
            type: String,
            required: true,
            trim: true
        },
        tags: {
            type: [String],
            default: []
        },
        technology: {
            type: String,
            default: '',
            trim: true
        },
        liveUrl: {
            type: String,
            default: '',
            trim: true
        },
        codeUrl: {
            type: String,
            default: '',
            trim: true
        },
        screenshot: {
            type: String,
            default: '',
            trim: true
        },
        iconClass: {
            type: String,
            default: 'fa-solid fa-clipboard-list',
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
