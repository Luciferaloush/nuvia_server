const errorHandler = require("../utils/error_handler");
const Users = require("../model/user");
const getMessage = require("../utils/message");
const Post = require("../model/post");

const add = errorHandler(async (req, res) => {
          const userId = req.user.id;
          const { language } = req.query;
          const { content, image, hashtag} = req.body;
          console.log("Received language:", language);

          if (!language || !['ar', 'en'].includes(language)) {
              return res.status(400).json({ message: "Invalid language" });
          }
          if(!content){
                    return res.status(404).json({
                              message: getMessage("contentandtopicsarerequired", language)
                    });
          }

          const newPost = new Post({
                    content,
                    image: image || null,
                    hashtag: hashtag || [],
                    creator: userId,
                    topics: { ar: [], en: [] } 
          });
          if (Array.isArray(hashtag)) {
            hashtag.forEach(tag => {
                if (tag.startsWith('#')) {
                    const topic = tag.slice(1);
                    if (language === 'en') {
                        newPost.topics.en.push(topic);
                    } else if (language === 'ar') {
                        newPost.topics.ar.push(topic);
                    }
                    newPost.hashtage.push(tag);
                } else {
                    return res.status(400).json({
                        message: getMessage("hashtagMustStartWithHash", language)
                    });
                }
            });
        }
          await newPost.save();
          await Users.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

    res.status(200).json({
        message: getMessage("postCreated", language),
        post: newPost,
    });
});
const myPosts = errorHandler(async (req, res) => {
          const { language } = req.query;
          if (!language || !['ar', 'en'].includes(language)) {
                    return res.status(400).json({ message: "Invalid language" });
                }
                const userId = req.user.id;
                if(!userId){
                    return res.status(404).json({
                              message: getMessage("userNotFound", language),
                    })
                }
                const myPost = await Users.findById(userId).populate('posts');
                const postsWithTopics = myPost.posts.map(post => ({
                    ...post.toObject(),
                    topics: post.topics[language] 
                }));
            
                res.status(200).json({
                    posts: postsWithTopics
                })
});
const allPosts = errorHandler(async (req, res) => {
          const { language } = req.query;
          if (!language || !['ar', 'en'].includes(language)) {
                    return res.status(400).json({ message: "Invalid language" });
                }
          const userId = req.user.id;
          if(!userId){
                    return res.status(404).json({
                              message: getMessage("userNotFound", language)
                    })
          }
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          const sendPosts = async() => {
                    const posts = await Post.find({creator: { $ne: userId }})
                    .populate('creator', 'firstname lastname');
                    res.write(`data: ${JSON.stringify(posts)}\n\n`)
          };
          sendPosts();
          const intervalId = setInterval(sendPosts, 1800000); 

          req.on('close', () => {
                    clearInterval(intervalId);
                    res.end();
                });
});

module.exports = {
          add,
          myPosts,
          allPosts,
}