const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const auth = require('../middlware/auth');
router.get('/profile/:id', auth, userController.getProfile);
router.post('/follow/:id', auth, userController.followUser);
router.post('/unfollow/:id', auth, userController.unFollowUser);
router.get('/followers', auth,  userController.getFollowers);
router.get('/following', auth, userController.getFollowing);
router.get('/posts/:userIdPost', auth, userController.post);
router.get('/users', auth, userController.getUsers);
router.get('/similar-users', auth, userController.getSimilarUsers);

module.exports = router;