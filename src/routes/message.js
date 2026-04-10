const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addMessage, getAllMessages, deleteMessage } = require('../controller/message/messageCon');

router.post('/add', addMessage);
router.get('/all', getAllMessages);
router.delete('/delete/:id', auth, deleteMessage);

module.exports = router;
