const crypto = require('crypto');
const { saveMessageToDatabase } = require('../db/storeData');

async function handleSocketConnection(io, socket) {
    console.log('User connected');

    socket.on('joinConversation', ({ userID, doctorID }) => {
        const conversationID = `${userID}_${doctorID}`;
        socket.join(conversationID);
    });

    // Event handler untuk pengiriman pesan
    socket.on('sendMessage', async (data) => {
        const { userID, doctorID, sender, message } = data;
        const conversationID = `${userID}_${doctorID}`;
        console.log(conversationID);
        const messageId = crypto.randomUUID();

        // Simpan pesan ke Firestore (atau database lainnya)
        await saveMessageToDatabase(conversationID, messageId, data);
        
        // Kirim pesan ke room percakapan yang sesuai
        io.to(conversationID).emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}

module.exports = handleSocketConnection;