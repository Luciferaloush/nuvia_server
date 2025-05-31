const express = require('express');
const router = express.Router();
const suggestController = require('../controller/suggestion');
const auth = require('../middlware/auth');

router.get('/suggestion-friend', auth, suggestController.suggestionFriend);

module.exports = router;