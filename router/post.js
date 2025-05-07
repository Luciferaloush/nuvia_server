const express = require('express');
const router = express.Router();
const postController = require('../controller/post');
const auth = require('../middlware/auth');

router.post('/add', auth, postController.add);
router.get('/my-posts', auth, postController.myPosts);
router.get('/all-posts', auth, postController.allPosts);
router.get('/foryou', auth, postController.foryou);

module.exports = router;