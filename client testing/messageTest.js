const io = require('socket.io-client');
const socket = io('http://localhost:8000');

// Event listener untuk pengiriman pesan dari dokter ke pengguna
function main() {
    const message = 'Hallo !';
    const userID = 'user_id';
    const doctorID = 'doctor_id';
    const sender = doctorID;
    socket.emit('sendMessage', { userID, doctorID, sender, message });
}

socket.on('connect', () => {
    console.log('Connected to server');
    main();
});

socket.on('message', (data) => {
    console.log('Received message:', data);
    // Tampilkan pesan di antarmuka dokter
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});