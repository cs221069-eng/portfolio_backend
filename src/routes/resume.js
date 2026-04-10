const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {
    uploadResume,
    getResume,
    deleteResume,
    downloadResume
} = require('../controller/resume/resumeCon');

const router = express.Router();

const uploadDirectory = path.resolve(__dirname, '../../uploads/resume');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDirectory),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`),
});

const resumeUpload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
            return;
        }

        cb(new Error('Only PDF files are allowed.'));
    },
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

router.post('/upload', resumeUpload.single('resume'), uploadResume);
router.get('/', getResume);
router.get('/download', downloadResume);
router.delete('/delete', deleteResume);

module.exports = router;
