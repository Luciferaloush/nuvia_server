const express = require('express');
const router = express.Router();
const contentController = require('../controller/content');
const admin = require('../middlware/admin');
const auth = require('../middlware/auth');

router.post('/add', admin, contentController.add);
router.get('/get-all-topic', auth,contentController.getAllTopic);
router.post('/select-topics', auth,contentController.selectTopics);
module.exports = router;