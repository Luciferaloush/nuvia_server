const errorHandler = require("../utils/error_handler");
const Users = require("../model/user");
const getMessage = require("../utils/message");
const Post = require("../model/post");
const  calculatePopularity  = require("../algorthim/popularity_based");
const evaluateRecommendation = require("../algorthim/fuzzy");

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
                    topics: { ar: [], en: [] },
                    likeStatus: false
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
          const user = await Users.findById(userId).populate('following');
          const userFollowedId = user.following;
          const posts = await Post.find({ creator: { $in: userFollowedId } })
        .populate('creator', 'firstname lastname');
        const likedPosts = await Post.find({ likes: userId }).distinct('_id');

    const postsWithLikeStatus = posts.map(post => ({
        ...post.toObject(),
        likeStatus: likedPosts.includes(post._id) 
    }));
        const engagement = await Post.find({'likes': userId});
        const userInterest  = await Users.findById(userId);
        const comments = await Post.find({'comments.userId': userId});
        const shared = await Post.find({"sharedPosts": userId});
        const engagements = engagement.length + comments.length + shared.length;
        const interest = userInterest ? userInterest.selectedTopics.length : 0;
        console.log(interest);
        let recommendationQuality  = evaluateRecommendation(interest, engagements);
        console.log(recommendationQuality);
        let message;1
    const postGR = await Post.find({}).sort({likes: -1}).limit(5)
    .populate('creator', 'firstname lastname');
    const postAR = await Post.find({}).limit(5).populate('creator', 'firstname lastname');
    const postBR = await Post.find({}).sort({createdAt: -1}).limit(5).populate('creator', 'firstname lastname');

    const response = {
        userPosts: postsWithLikeStatus, 
    };

    if (recommendationQuality === "ER") {
        recommendationQuality = "GR";  
    }

    if (recommendationQuality === "GR") {
        message = "تقديم المحتوى مع تعزيزات";
        response.recommendedPosts = postGR;
    } else if (recommendationQuality === "AR") {
        message = "عرض المحتوى مع خيارات إضافية";
        response.recommendedPosts = postAR;
    } else if (recommendationQuality === "BR") {
        message = "إعادة تقييم المحتوى";
        response.recommendedPosts = postBR;
    }

    res.status(200).json({
        message: message,
        ...response, 
    });
    
});
const updateFeaturedPosts = async () => {
    const posts = await Post.find();
    console.log(`عدد المشاركات: ${posts.length}`);

    for (const post of posts) {
        const isFeatured = post.likes.length > 2 && post.comments.length > 5; 
        
        console.log(`Post ID: ${post._id}, Likes: ${post.likes.length}, Comments: ${post.comments.length}, Is Featured: ${isFeatured}`);

        post.isFeatured = isFeatured;
        await post.save();
    }

    console.log("تم تحديث حالة المحتوى المميز");
};

const foryou = errorHandler(async (req, res) => {
    const { language } = req.query;
    if(!language || !['ar', 'en'].includes(language)){
        return res.status(404).json({
            message: getMessage("invalidLanguage", language)
        });
    }
    const userId = req.user.id;
    const posts = await Post.find({}).populate('creator', 'firstname lastname');
    const topPost = calculatePopularity(posts);
    const likeStatuses = await Post.find({ likes: userId }).distinct('_id');

    const topPostWithLikeStatus = topPost.map(post => ({
        ...post,
        likeStatus: likeStatuses.includes(post._id) 
    }));

    topPost.forEach(post => {
        console.log(`POST ID: ${post._id}, Weighted Popularity: ${post.weightedPopularity}`)
});
if (!topPost || typeof topPost === 'undefined') {
    return res.status(500).json({ message:getMessage("error_calculating_popularity.", language) });
}
const engagement = await Post.find({'likes': userId});
        const userInterest  = await Users.findById(userId);

        const comments = await Post.find({'comments.userId': userId});
                const shared = await Post.find({"sharedPosts": userId});
                const engagements = engagement.length + comments.length + shared.length;
        const interest = userInterest ? userInterest.selectedTopics.length : 0;
        const recommendationQuality  = evaluateRecommendation(interest, engagements)
        const postER = await Post.find({isFeatured: true}).limit(5)
        .populate("creator", "firstname lastname");
        const postERWithLikeStatus = postER.map(post => ({
        ...post,
        likeStatus: likeStatuses.includes(post._id) 
    }));
        let message;
        if(recommendationQuality === "ER"){
            message = "ER";
            console.log("Returning ER posts");
            res.status(200).json({
                message:message,
                excellentReco:postERWithLikeStatus,
                topPost: topPostWithLikeStatus
            });
        }else{
            message = "TP";
res.status(200).json({
    message:  message,
    post: topPostWithLikeStatus
});}
});
module.exports = {
          add,
          myPosts,
          allPosts,
          foryou,
          updateFeaturedPosts
}