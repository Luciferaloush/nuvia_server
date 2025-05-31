const express = require('express');
const router = express.Router();
const messageController = require('../controller/message');
const auth = require('../middlware/auth');

router.get('/getConvId/:conversationId', auth, messageController.fetchAllMessagesByConversationId);

module.exports = router;
