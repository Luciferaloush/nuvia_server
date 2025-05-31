const { Conversation } = require("../model/conversation");
const { Messages } = require("../model/message");
const errorHandler = require("../utils/error_handler");

const fetchAllMessagesByConversationId = errorHandler(async (req, res) => {
          const conversationId = req.params.conversationId;
          if(!conversationId){
                    return res.status(404).send({
                              message: 'No conversationId'
                    })
          }
          const conversation = await Conversation.findById(conversationId);
          if(!conversation){
                    return res.status(404).send({
                           message:"No Conversation"
                    });
          }
          const messages = await Messages.find({ conversationId: conversationId });

    res.status(200).send({
        messages 
    });
          
})
const saveMessage= errorHandler( async (conversationId, senderId, content) => {
          if(!conversationId || !senderId || !content){
                    throw new Error("المعلومات المطلوبة مفقودة");}
                    const newMessage = new Messages({
                              conversationId: conversationId,
                              senderId: senderId,
                              content: content
                    });
                    const message = await newMessage.save();
                    return message;
})
module.exports = {
          fetchAllMessagesByConversationId,
          saveMessage,
}