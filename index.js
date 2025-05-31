require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const DB = require('./config/db');
const { updateFeaturedPosts } = require('./controller/post');
const { saveMessage } = require('./controller/message');
const { getUsernameById } = require('./controller/conversation');
const { Conversation } = require('./model/conversation');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

DB();
const nuvia = "/nuvia/v1";
app.use(`${nuvia}/api/auth`, require('./router/auth'));
app.use(`${nuvia}/api/content`, require('./router/content'));
app.use(`${nuvia}/api/post`, require('./router/post'));
app.use(`${nuvia}/api/post/interaction`, require('./router/post_interaction'));
app.use(`${nuvia}/api/user`, require('./router/user'));
app.use(`${nuvia}/api/notification`, require('./router/notification'));
app.use(`${nuvia}/api/conversation`, require('./router/conversation'));
app.use(`${nuvia}/api/message`, require('./router/message'));
app.use(`${nuvia}/api/suggestion`, require('./router/suggestion'));

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    
    socket.on('join', (conversationId) => {
        console.log(`Joined conversation: ${conversationId}`);
        socket.join(conversationId);
    });
    
    socket.on('sendMessage', async (message) => {
        const { conversationId, senderId, content } = message;
        console.log(`Received message: ${message}`);
        
        try {
            await saveMessage(conversationId, senderId, content);
            console.log("Message saved successfully.");
            
            const conversation = await Conversation.findById(conversationId);
            const receiverId = conversation.participantOne.toString() === senderId ? conversation.participantTwo : conversation.participantOne;
            const senderName = await getUsernameById(senderId);
            const receiverName = await getUsernameById(receiverId);
            
            const newMessageData = {
                conversationId,
                senderId,
                senderName,
                receiverName,
                content,
                createdAt: new Date()
            };
            
            io.to(conversationId).emit("newMessage", newMessageData);
            console.log(`New message emitted: ${newMessageData}`);
            io.emit("conversationUpdated", newMessageData);
            console.log(`Conversation updated: ${newMessageData}`);
        } catch (e) {
            console.log("Error in sendMessage:", e);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

cron.schedule('* * * * *', async () => {
    try {
        console.log('Updating featured content...');
        await updateFeaturedPosts();
    } catch (error) {
        console.error("Error updating featured content:", error);
    }
});