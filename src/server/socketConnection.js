const crypto = require('crypto');
const { saveMessageToDatabase } = require('../db/storeData');

async function handleSocketConnection(io, socket) {
    socket.on('joinConversation', ({ userID, doctorID, sender}) => {
        const conversationID = `${userID}_${doctorID}`;
        socket.join(conversationID);
        const message = `${sender} has connected`;
        const msgData = { sender, message }
        io.to(conversationID).emit('chat-message', msgData);
    });

    socket.on('sendMessage', async (data) => {
        const { conversationID, sender, message } = data;
        const msgData = { sender, message }
        const messageId = crypto.randomUUID();

        await saveMessageToDatabase(conversationID, messageId, data);
        
        io.to(conversationID).emit('chat-message', msgData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}

module.exports = handleSocketConnection;