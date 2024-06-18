const crypto = require('crypto');
const { saveMessageToDatabase } = require('../db/storeData');

async function socketConnectionHandler(io, socket) {
    // Build a private room based on user ID and doctor ID
    socket.on('joinConversation', ({ userID, doctorID, sender}) => {
        const conversationID = `${userID}_${doctorID}`;
        socket.join(conversationID);
        const message = `${sender} has connected`;
        const msgData = { sender, message }
        io.to(conversationID).emit('chat-message', msgData);
    });

    // Sending message to the assigned private room
    socket.on('sendMessage', async (data) => {
        const { conversationID, sender, message } = data;
        const msgData = { sender, message }
        const messageId = crypto.randomUUID();

        await saveMessageToDatabase(conversationID, messageId, msgData);
        
        io.to(conversationID).emit('chat-message', msgData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}

module.exports = socketConnectionHandler;