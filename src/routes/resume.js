const express = require('express');
const multer = require('multer');
const {
    uploadResume,
    getResume,
    deleteResume,
    downloadResume
} = require('../controller/resume/resumeCon');

const router = express.Router();

const resumeUpload = multer({
    storage: multer.memoryStorage(),
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
