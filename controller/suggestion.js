const errorHandler = require("../utils/error_handler");
const Users = require("../model/user");
const getMessage = require("../utils/message");
const suggestFriends = require("../algorthim/fof");
async function buildSocialGraph() {
    const users = await Users.find().populate('following');
    const graph = {};
    
    users.forEach(user => {
        graph[user._id] = user.following.map(friend => friend._id.toString());
    });
    
    return graph;
}
const suggestionFriend = errorHandler(async (req, res) => {
          const userId = req.user.id;
        
        const socialGraph = await buildSocialGraph();
        
        if (!socialGraph[userId]) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const suggestedFriends = suggestFriends(userId, socialGraph);
        
        const enrichedSuggestions = await Promise.all(
            suggestedFriends.map(async ({user}) => {
                const userDetails = await Users.findById(user)
                    .select('firstname lastname image');
                return {
                    ...userDetails.toObject(),
                    mutualFriends: count 
                };
            })
        );
        
        res.status(200).json(enrichedSuggestions.slice(0, 10));          
})

module.exports = {suggestionFriend};