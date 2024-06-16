const socket = io('http://localhost:8000') // ganti ke link yang baru
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const userID = prompt('What is your userID?')
const doctorID = prompt('what is your doctorID?')
const conversationID = `${userID}_${doctorID}`
const sender = doctorID; // sender ini di set ke ID user / doctor tergantung tipe usernya, kalo login as user sender di set ke user, berlaku juga kalo dokter


// ---------------------  fungsi utama chat  --------------------- \\
socket.emit('joinConversation', {userID, doctorID, sender})

socket.on('chat-message', msgData => {
  appendMessage(`${msgData.sender}: ${msgData.message}`)
})

socket.on('user-connected', sender => {
  appendMessage(`${sender} connected`)
})

socket.on('user-disconnected', sender => {
  appendMessage(`${sender} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  const data = { conversationID, sender, message }
  appendMessage(`You: ${message}`)
  socket.emit('sendMessage', data)
  messageInput.value = ''
})
// ^^^^^^^^^^^^^^^^^^^^^  fungsi utama chat  ^^^^^^^^^^^^^^^^^^^^^ \\

// fungsi buat frontend, sesuaikan aja sama kotlin kek gmn
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}