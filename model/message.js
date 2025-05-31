const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    conversationId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Conversation',
          required: true
         },
    senderId: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Users', 
         required: true
         },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Messages = mongoose.model('Messages', messageSchema);
 module.exports = {Messages};
