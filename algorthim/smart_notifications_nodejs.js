const express = require('express');
const Users = require('../model/user');
const Post = require('../model/post');
const Notification = require('../model/notification');

// ======= تحليل منشورات المستخدم وتحديث اهتماماته =======
const updateUserInterests = async(user)=> {
  const userId = user._id;
  const posts = await Post.find({
    $or: [
      {likes: userId},
      {sharedPosts: userId},
      {'comments.userId': userId}
    ]
  });

  const keywords = {};
  posts.forEach(post => {
    const allTopics = [
      ...(post.topics?.ar || []),
      ...(post.topics?.en || []),
      ...(post.hashtage || [])
    ];
    allTopics.forEach(word => {
      if(!word) return;
      keywords[word] = (keywords[word] || 0) + 1;
    });
  });

  const sorted = Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, 10);

  user.selectedTopics = sorted;
  await user.save();
}
const generateNotifications = async () => {
  const users = await Users.find();
  console.log("Users:", users); // تحقق من أن هناك مستخدمين
  for (const user of users) {
    await updateUserInterests(user);

    const posts = await Post.find({
      createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 365) }, 
    });
posts.forEach(async post => {
    const allTopics = [
      ...(post.topics?.ar || []),
      ...(post.topics?.en || []),
      ...(post.hashtage || [])
    ];
    const matched = allTopics.filter(k => 
      user.selectedTopics.includes(k)
    );
    if(matched.length >= 1){
      const notification = new Notification({
          userId: user._id,
          title: `منشور جديد يعجبك!`,
          body: `في منشور عن ${matched.join(", ")} ممكن يعجبك!`,
        });
       await notification.save();
    }
  })
    
  }
}



// app.get('/notifications/:userId', async (req, res) => {
//   const userId = req.params.userId;
//   const notifications = await Notification.find({ userId, delivered: false });

//   // ضع الإشعارات كمرسلة
//   await Notification.updateMany({ userId, delivered: false }, { delivered: true });

//   res.json(notifications);
// });


module.exports = {
updateUserInterests,
generateNotifications
}
