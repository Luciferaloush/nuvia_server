const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification');
const auth = require('../middlware/auth');
router.get('/notification', auth, notificationController.notification);


module.exports = router;