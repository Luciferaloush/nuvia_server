const express = require('express');
const router = express.Router();
const interactioController = require('../controller/post_interactions');
const auth = require('../middlware/auth');

router.post('/like', auth, interactioController.likePost);
router.get('/:postId/likes', auth, interactioController.allLikes);
router.post('/:postId/comments', auth, interactioController.addComment);
router.get('/:postId/comments', auth, interactioController.allCommentsPost); 
router.get('/my-comments', auth, interactioController.myComments); 
router.get('/my-comments', auth, interactioController.myComments); 
router.post('/:postId/share-post', auth, interactioController.sharePost); 
router.get('/my-shared-posts', auth, interactioController.mySharedPosts); 
router.get('/:postId/num-likes', auth, interactioController.numOfLikes); 
router.get('/:postId/num-comments', auth, interactioController.numOfComments); 
router.get('/:postId/num-share', auth, interactioController.numOfShares); 



module.exports= router;