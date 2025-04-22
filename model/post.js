const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    content: {
        type: String,
        required: true, 
    },
    image: {
        type: String, 
        default: null,
    },
    topics: {
        ar: { type: [String], default: [] },
        en: { type: [String], default: [] },
    },
    hashtage: {
        type: [String],
        default: [],
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    likes: [{ 
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
      }],
      comments:[{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
      }],
      sharedPosts: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    }],
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;