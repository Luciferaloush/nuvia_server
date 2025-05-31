const { Conversation } = require("../model/conversation");
const { Messages } = require("../model/message");
const Users = require("../model/user");
const errorHandler = require("../utils/error_handler");

const conversation = errorHandler(async (req, res) => {
          const userId = req.user.id;
              console.log("User ID:", userId); 
              const conversations = await Conversation.find({
                    $or: [
                       {participantOne: userId},
                       {participantTwo: userId}       
                    ]
              })
              .populate('participantOne', 'firstname lasetname')
              .populate('participantTwo', 'firstname lastname');
               console.log("Conversations:", conversations);

    const result = await Promise.all(conversations.map(
        async (conversation) => {
            const lastMessage = 
            await Messages.findOne({ conversationId: conversation._id }).
            sort({ createdAt: -1 });
            const otherParticipant = 
            conversation.participantOne._id.toString() === userId.toString()
                ? conversation.participantTwo
                : conversation.participantOne;
            return {
                conversationId: conversation._id.toString(),
                firstname: otherParticipant.firstname,
                lastname: otherParticipant.lastname,
                lastMessage: lastMessage ? lastMessage.content : null, 
                createdAt: lastMessage ? lastMessage.createdAt : null 
            };
        }
    ));
    res.json(result);
});
const getUsernameById = async (userId) => {
    try {
        const user = await Users.findById(userId).select('firstname');
        return user ? user.firstname : null; 
    } catch (error) {
        console.error("Error fetching username:", error);
        return null;
    }
};
const cheakOrCreateConversation = errorHandler(async (req, res) => {
    const { userId } = req.body;
    const currentUserId = req.user ? req.user.id : null;

    if (!userId || !currentUserId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    if (currentUserId === userId) {
        return res.status(400).json({ message: "Cannot start a conversation with yourself." });
    }
    let conversation = await Conversation.findOne({
        $or: [
            { participantOne: currentUserId, participantTwo: userId },
            { participantOne: userId, participantTwo: currentUserId }
        ]
    });

    if (conversation) {
        return res.status(200).json({
            conversationId: conversation._id.toString(),
            participantOne: conversation.participantOne.toString(),
            participantTwo: conversation.participantTwo.toString(),
            createdAt: conversation.createdAt,
            __v: conversation.__v
        });
    }

    conversation = new Conversation({
        participantOne: currentUserId,
        participantTwo: userId,
    });
    await conversation.save();

    res.status(201).json({
        conversationId: conversation._id.toString(),
        participantOne: conversation.participantOne.toString(),
        participantTwo: conversation.participantTwo.toString(),
        createdAt: conversation.createdAt,
        __v: conversation.__v
    });
});

module.exports = {
          conversation,
          getUsernameById,
          cheakOrCreateConversation
}