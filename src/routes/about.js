const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadAboutInfo, getAboutInfo, updateAboutInfo } = require('../controller/about/aboutCon'); 

// Create or update about information
router.post('/upload', auth, uploadAboutInfo);

// Get about information
router.get('/', getAboutInfo);

router.patch('/update', auth, updateAboutInfo);


module.exports = router;
