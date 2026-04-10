const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const registerUser = require('../controller/user/register');

router.post('/register', registerUser.registerUser);

router.post('/login', registerUser.loginUser); 
router.get('/me', auth, registerUser.getCurrentUser);
router.post('/logout', auth, registerUser.logoutUser);

module.exports = router;
