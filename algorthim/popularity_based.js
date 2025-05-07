// const posts = [
//           {id: 1, likes:5, comments: 2, share: 1},
//           {id: 2, likes:0, comments: 0, share: 0},
//           {id: 3, likes:2, comments: 1, share: 0},
//           {id: 4, likes:10, comments: 5, share: 2},
//           {id: 5, likes:0, comments: 0, share: 0},
//           {id: 6, likes:3, comments: 1, share: 0},
//           {id: 7, likes:7, comments: 4, share: 1},
//           {id: 8, likes:1, comments: 0, share: 0},
//           {id: 9, likes:4, comments: 2, share: 1},
//           {id: 10, likes:6, comments: 3, share: 1},
// ];
const weights = {
          likes:1,
          comments:3,
          share:5
};

const calculatePopularity = (posts) => {
          const popularPosts = posts.filter(post => 
              Array.isArray(post.likes) && post.likes.length > 0 && 
              Array.isArray(post.comments) && post.comments.length > 0 && 
              Array.isArray(post.sharedPosts) && post.sharedPosts.length > 0
          ).map(post => {
              const weightedPopularity = (Array.isArray(post.likes) ? post.likes.length : 0 * weights.likes) +
                                         (Array.isArray(post.comments) ? post.comments.length : 0 * weights.comments) +
                                         (Array.isArray(post.sharedPosts) ? post.sharedPosts.length : 0 * weights.share);
                                         return {  ...post.toObject(), weightedPopularity };
          });
          popularPosts.sort((a, b) => b.weightedPopularity - a.weightedPopularity);
          return popularPosts.slice(0, 25); 
      };

// const topPost = calculatePopularity(posts);

// console.log("top 10 posts:");
// topPost.forEach(post => {
//           console.log(`POST ID: ${post.id}, Weighted Popularity: ${post.weightedPopularity}`)
// });

module.exports = calculatePopularity;