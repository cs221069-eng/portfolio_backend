const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.resolve(__dirname, '../../uploads/projects');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname || '');
        const safeBaseName = path
            .basename(file.originalname || 'project-screenshot', extension)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();

        cb(null, `${Date.now()}-${safeBaseName}${extension}`);
    }
});

const fileFilter = (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
        return;
    }

    cb(new Error('Only image uploads are allowed.'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;
