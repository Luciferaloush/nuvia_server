const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification');
const auth = require('../middlware/auth');
router.get('/all-notification', auth, notificationController.getNotification);


module.exports = router;