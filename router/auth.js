const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const auth = require('../middlware/auth');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.profile);
//router.post('/send-verification-code', authController.sendVerificationCode);
//router.post('/reset-password', authController.restPassword);


module.exports = router;