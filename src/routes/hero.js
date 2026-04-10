const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getHeroData, uploadHeroData, updateHeroData } = require('../controller/hero/heroCon');

//hero data    
router.get('/', getHeroData);

router.post('/upload', auth, uploadHeroData);

router.patch('/update', auth, updateHeroData);


module.exports = router;
