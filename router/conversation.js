const express = require('express');
const router = express.Router();
const conversationController = require('../controller/conversation');
const auth = require('../middlware/auth');
router.get('/my-conversation', auth, conversationController.conversation);
router.post('/check-conv',auth ,conversationController.cheakOrCreateConversation);


module.exports = router;