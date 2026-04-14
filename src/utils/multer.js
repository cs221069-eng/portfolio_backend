const multer = require('multer');

// MEMORY STORAGE (Vercel safe)
const storage = multer.memoryStorage();

// FILE FILTER (FIXED)
const fileFilter = (_req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
        return;
    }

    cb(new Error('Only image and PDF uploads are allowed.'));
};

// MULTER CONFIG
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

module.exports = upload;
