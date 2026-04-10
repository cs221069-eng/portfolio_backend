const multer = require('multer');

// ✅ MEMORY STORAGE (Vercel compatible)
const storage = multer.memoryStorage();

// ✅ FILE FILTER (same tera logic)
const fileFilter = (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
        return;
    }

    cb(new Error('Only image uploads are allowed.'));
};

// ✅ MULTER CONFIG
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;