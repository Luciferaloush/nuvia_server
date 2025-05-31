const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participantOne: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    participantTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now }
});
const Conversation = mongoose.model('Conversation', conversationSchema);
 module.exports = {Conversation};
