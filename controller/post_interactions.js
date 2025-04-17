const Post = require("../model/post");
const Users = require("../model/user");
const errorHandler = require("../utils/error_handler");
const getMessage = require("../utils/message");

const likePost = errorHandler(async (req, res) => {
          const { language } = req.query;
          if (!language || !['ar', 'en'].includes(language)) {
                    return res.status(400).json({ message: "Invalid language" });
                }
          const { postId } = req.body;
          const userId = req.user.id;
          const post = await Post.findById(postId);
          if(!post){
                    return res.status(404).json({
                              message:getMessage("postNotFound", language)
                    })
          }
          if(!userId){
                    return res.status(404).json({
                              message:getMessage("userNotFound", language)
                    })
          }
          if(!post.likes.includes(userId)){
                    post.likes.push(userId);
                    await post.save();
                    return res.status(200).json({
                              message:getMessage("postLikedSuccessfully", language)
                    })
          }else {
                    return res.status(400).json({ message: 'You already liked this post' });
                }

});
const allLikes = errorHandler(async (req, res) => {
          const { language } = req.query;
          if (!language || !['ar', 'en'].includes(language)) {
                    return res.status(400).json({ message: "Invalid language" });
                }
          const {postId} = req.params;
          const post = await Post.findById(postId).populate('likes', 'firstname lastname');
          if(!post){
                    return res.status(404).json({
                              message: getMessage("postNotFound", language)
                    })
          }
          const likeWithName = post.likes.map(user=>(
                    {
                              userId:user._id,
                              firstname: user.firstname,
                              lastname: user.lastname
                    }));
                    res.status(200).json({
                              postId:post._id,
                              likes:likeWithName,
                              totalLikes:post.likes.length
                    })
})
const addComment = errorHandler(async (req, res) => {
    const { language } = req.query;
    if (!language || !['ar', 'en'].includes(language)) {
              return res.status(400).json({ message: "Invalid language" });
          }
          const userId = req.user.id;
          const user = await Users.findById(userId); 
    if (!user) {
        return res.status(404).json({
            message: getMessage("userNotFound", language)
        });
    }
          const { postId } = req.params;
          const { comment } = req.body;
          const post = await Post.findById(postId);
          if(!post){
            return res.status.json({
                message: getMessage("postNotFound")
            })
          }

          post.comments.push({ userId, comment});
          
          await post.save();
          res.status(200).json({
            message:getMessage("commentAdded", language),
            comment: {
                userId: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                comment: comment,
                createdAt: new Date(), 
            }
          })

})
const allCommentsPost = errorHandler(async (req, res) => {
    const { language } = req.query;
    if(!language ||!['ar', 'en'].includes(language) ){
        return res.status(400).json({ message: "Invalid language" });

    }
    const userId = req.body;
          if(!userId){
            return res.status(404).json({
                message: getMessage("userNotFound", language)
            })
          }
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          const sendComments =async () => {
            const { postId } = req.params;
            const post = await Post.findById(postId).populate('comments.userId', 'firstname lastname');
            if (!post) {
                res.write(`data: ${JSON.stringify({ error: getMessage("psotNotFound", language) })}\n\n`);
            return;
            }
            const commentsWithNames = post.comments.map(comment =>({
                userId: comment.userId._id,
                firstname: comment.userId.firstname,
            lastname: comment.userId.lastname,
            comment: comment.comment,
            createdAt: comment.createdAt,
            }));
            res.write(`data: ${JSON.stringify({ comments: commentsWithNames })}\n\n`);

          }
          
        
          sendComments(); 
          const intervalId = setInterval(sendComments, 150000 ); 

          req.on('close', () => {
                    clearInterval(intervalId);
                    res.end();
                });
 
})
const myComments = errorHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await Users.findById(userId); 
if (!user) {
  return res.status(404).json({
      message: getMessage("userNotFound", language)
  });
}
const posts = await Post.find({'comments.userId': userId}).populate(
    'comments.userId', 'firstname lastname'
).populate('creator', 'firstname lastname');
const userComments = posts.flatMap(post =>
    post.comments
    .filter(comment => comment.userId._id.toString() === userId)
    .map(comment => ({
        
                replies: {
                    postId : post._id,
                    comment: comment.comment,
                    firstname: comment.userId.firstname,
                    lastname: comment.userId.lastname,
                },
                postOwner: {
                    content:post.content,
                    image:post.image || null,
                    firstname: post.creator.firstname,
                    lastname: post.creator.lastname,
                },
                createdAt: comment.createdAt,
    }))
)
res.status(200).json({
    userId: user._id,
    comments: userComments,
    totalComments: userComments.length,
});
})
const sharePost = errorHandler(async (req, res) => {
    const { language } = req.query;
    if (!language || !['ar', 'en'].includes(language)) {
        return res.status(400).json({
            message: "Invalid language"
        });
    }

    const userId = req.user.id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({
            message: getMessage("postNotFound", language)
        });
    }

    await Post.findByIdAndUpdate(postId, { $push: { sharedPosts: userId } });

    await Users.findByIdAndUpdate(userId, { $push: { sharedPosts: postId } });

    res.status(200).json({
        message: getMessage("postSharedSuccessfully", language),
        post: post,
    });
});
const mySharedPosts = errorHandler(async (req, res) => {
    const { language } = req.query;
    if(!language || !["en", "ar"].includes(language)){
        return res.status(404).json({
            message: "Language is valid"
        })
    }
    const userId = req.user.id;
    const user = await Users.findById(userId).populate({
        path: "sharedPosts",
        populate:{
            path: "creator",
            select: "firstname lastname"
        }
    });
    if (!user) {
        return res.status(404).json({
            message: getMessage("userNotFound", language)
        });
    }
    const sharedPosts = user.sharedPosts.map(post =>({
        postId: post._id,
        content: post.content,
        image: post.image || null,
        crcreatedAt: post.createdAt,
        creator: {
            firstname: post.creator.firstname,
            lastname: post.creator.lastname
        }
    }));
    res.status(200).json({
        sharedPosts: sharedPosts,
        totalSharedPosts: sharedPosts.length,
    });
});
const numOfLikes = errorHandler(async (req, res) => {
    const userId = req.user.id;
    const { language } = req.query;
    if(!language || !['en', 'ar'].includes(language)){
        return res.staus.json({
            message: "Language is valid",
        })
    }
    if(!userId){
        return res.status(404).json({
            message:getMessage("userNotFound", language)
        })
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({
            message: getMessage("postNotFound", language),
        })
    }
    res.status(200).json({
        likes: post.likes.length
    })
});

const numOfComments = errorHandler(async (req, res) => {
    const userId = req.user.id;
    const { language } = req.query;
    if(!language || !['en', 'ar'].includes(language)){
        return res.staus.json({
            message: "Language is valid",
        })
    }
    if(!userId){
        return res.status(404).json({
            message:getMessage("userNotFound", language)
        })
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({
            message: getMessage("postNotFound", language),
        })
    }
    res.status(200).json({
        comments: post.comments.length
    })
});

const numOfShares = errorHandler(async (req, res) => {
    const userId = req.user.id;
    const { language } = req.query;
    if(!language || !['en', 'ar'].includes(language)){
        return res.staus.json({
            message: "Language is valid",
        })
    }
    if(!userId){
        return res.status(404).json({
            message:getMessage("userNotFound", language)
        })
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({
            message: getMessage("postNotFound", language),
        })
    }
    res.status(200).json({
        share: post.sharedPosts.length
    })
});

module.exports = {
          likePost,
          allLikes,
          addComment,
          allCommentsPost,
          myComments,
          sharePost,
          mySharedPosts,
          numOfLikes,
          numOfComments,
          numOfShares

}