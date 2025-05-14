const Users = require("../model/user");
const errorHandler = require("../utils/error_handler");
const getMessage = require("../utils/message");
const getProfile = errorHandler(async (req, res) => {
          const { language } = req.query;
        
          if (!language || !['ar', 'en'].includes(language)) {
            return res.status(400).json({ message: getMessage('invalidLanguage', language) });
          }
  
          const currentUserId = req.user.id;
                    const me = await Users.findById(currentUserId);
                    console.log(me);
          const userId = req.params.id;
          const user = await Users.findById(userId)
            .populate('followers', '_id firstname lastname')
            .populate('following', '_id firstname lastname')
            .populate('posts');
        console.log("Current User ID:", currentUserId);
console.log("User ID:", userId);
console.log("User Followers:", user.followers);
console.log("User Following:", user.following);
          if (!user) {
            return res.status(404).json({
              message: getMessage('userNotFound', language),
            });
          }
        if(user.following._id === userId){
          console.log("this is following")
        }
        if(user.followers._id === userId){
          console.log("this is not following")
        }
          const isFollowing = user.following.some(follow => follow._id.toString()
           === currentUserId.toString());
    const isFollowedBy = user.followers.some(follower => follower._id.toString() ===
     currentUserId.toString());


let followingStatus;
if (isFollowing && isFollowedBy) {
    followingStatus = 1; 
} else if (isFollowing) {
    followingStatus = 0;
} else if (isFollowedBy) {
    followingStatus = 2; 
} else {
    followingStatus = 3; 
}
          const postUser = user.posts.map(post => ({
            _id: post._id,
            content: post.content,
            image: post.image,
            topics: post.topics,
            hashtage: post.hashtage,
            firstname: post.creator.firstname,
            lastname: post.creator.lastname,
            likes: post.likes,
            comments: post.comments,
            sharedPosts: post.sharedPosts,
            createdAt: post.createdAt
        }));
          res.json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            topics: user.selectedTopics,
            followers: user.followers.length,
            following: user.following.length,
            followingStatus: followingStatus,
            pots: postUser
          });
        });
const getUsers = errorHandler(async (req, res) => {
  const userId = req.user.id;
  console.log(`userId ${userId}`);
  
  const currentUser = await Users.findById(userId).populate('following').populate('followers');

  const followingIds = currentUser.following.map(user => user._id.toString());
  const followersIds = currentUser.followers.map(follower => follower._id.toString());

  const users = await Users.find({ _id: { $nin: followingIds } });

  const userResponse = users.map(user => {
    const isFollowedBy = followersIds.includes(user._id.toString());
    
    return {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      followingStatus: isFollowedBy ? "Follow Back" : "Follow"
    };
  });

  res.status(200).json({
    users: userResponse
  });
});

const followUser  = errorHandler(async (req, res) => {
          const {language} = req.query;
    
          if (!language || !['ar', 'en'].includes(language)) {
              return res.status(400).json({ message: getMessage('invalidLanguage', language) });
          } ;
          const userId = req.params.id;
          const currentUserId = req.user.id;
          await Users.findByIdAndUpdate(currentUserId, {
                    $addToSet: { following: userId}
          });
          await Users.findByIdAndUpdate(userId, {
                    $addToSet: {followers: currentUserId}
          });
          res.json({ message: 'Now following the user' });

})
const unFollowUser = errorHandler(async (req, res) => {
          const {language} = req.query;
    
          if (!language || !['ar', 'en'].includes(language)) {
              return res.status(400).json({ message: getMessage('invalidLanguage', language) });
          } ;
          const userId = req.params.id;
          const currentUserId = req.user.id;
          await Users.findByIdAndUpdate(currentUserId, {
                    $pull: { following: userId}
          });
          await Users.findByIdAndUpdate(userId, {
                    $pull: {followers: currentUserId}
          });
          res.json({ message: 'Unfollowed the user' });
});
const getFollowers  = errorHandler(async (req, res) => {
          const {language} = req.query;
    
          if (!language || !['ar', 'en'].includes(language)) {
              return res.status(400).json({ message: getMessage('invalidLanguage', language) });
          } ;
          const userId = req.user.id;
          const user = await Users.findById(userId)
          .populate('followers', 'firstname lastname');
          if (!user) {
                    return res.status(404).json({
                      message: getMessage('userNotFound', language),
                    });
                  }
                const followersList  = user.followers.map(follower => ({
                    id: follower._id,
                    firstname: follower.firstname,
                    lastname: follower.lastname
                }));
                res.status(200).json({
                    followers: followersList
                })
});
const getFollowing = errorHandler(async (req, res) => {
          const { language } = req.query;
        
          if (!language || !['ar', 'en'].includes(language)) {
            return res.status(400).json({ message: getMessage('invalidLanguage', language) });
          }
        
          const userId = req.user.id;
        
          const user = await Users.findById(userId)
            .populate('following', 'firstname lastname'); 
        
          if (!user) {
            return res.status(404).json({
              message: getMessage('userNotFound', language),
            });
          }
        
          const followingList = user.following.map(followed => ({
            id: followed._id,
            firstname: followed.firstname,
            lastname: followed.lastname,
          }));
        
          res.json({ following: followingList });
        });
  const post = errorHandler(async (req, res) => {
          const { language } = req.query;
        
          if (!language || !['ar', 'en'].includes(language)) {
            return res.status(400).json({ message: getMessage('invalidLanguage', language) });
          }
        
          const userId = req.user.id;
          if(!userId){
            return res.status(404).json({
              message: getMessage("userNotFound", language)
            })
          }
          const userIdPost = req.params;
          const posts = await Users.findById(userIdPost)
          .populate('posts');
          res.status(200).json({
            posts
          })
        });
module.exports = {
          getProfile,
          followUser,
          unFollowUser,
          getFollowers,
          getFollowing,
          post,
          getUsers
}