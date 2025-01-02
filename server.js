import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import { Server } from 'socket.io';
import { createServer } from 'http';
import { register, fetchAllUsers, loginUser } from "./controllers/authController.js";
import { uploadImages } from "./controllers/storageController.js";
//import crypto from "crypto"
import { v4 as uuidv4 } from 'uuid';
import { saveChats, getAllTexts, userOnline, checkUserOnline, deleteUserOnline, deleteMessages } from "./controllers/chatsController.js";


import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() });
dotenv.config();
// const secretKey = crypto.randomBytes(32).toString('hex');

// console.log('Generated Secret Key:', secretKey);
const app = express()
app.use(express.json()) //allow accept json data in req.body

// Create an HTTP server and integrate Socket.IO with it
const server = createServer(app);
const io = new Server(server);
const onlineUsers = new Map();
const typingUsers = new Map();
// When a client connects to the WebSocket
io.on('connection', (socket) => {

    socket.on('userConnected', ({ userId }) => {
        console.log(`${userId} connected`);

        //   userOnline(userId);
        onlineUsers.set(socket.id, userId);

        io.emit('userStatusUpdate', Array.from(onlineUsers.values()));
    });


    socket.on('userTyping', ({ userId }) => {

        typingUsers.set(socket.id, userId);

        io.emit('userTypingUpdate', Array.from(typingUsers.values()));
    });

    socket.on('userTypingStop', ({ userId }) => {

        typingUsers.delete(socket.id, userId);

        io.emit('userTypingUpdate', Array.from(typingUsers.values()));
    });

    // Handle chat messages or other events here
    socket.on('chatMessage', async (message) => {
        const chatId = uuidv4();
        console.log('Message received:', message);
        saveChats({ chatId, ...message })
        try {

            //broadcast the message to all connected clients
            io.emit('chatMessage', { chatId, ...message });
        } catch (error) {
            console.log(error)

        }


    });

    socket.on('disconnect', () => {
        const userId = onlineUsers.get(socket.id);
        console.log(userId, '........disconnected user')
        onlineUsers.delete(socket.id);
        io.emit('userStatusUpdate', Array.from(onlineUsers));
        // deleteUserOnline(userId)
        console.log('user disconnected');
    });
});

app.post("/api/auth", register)
app.get("/api/users", fetchAllUsers)
app.post("/api/login", loginUser)
app.get("/api/user-chats", getAllTexts)
app.get("/api/delete-messages/:messageId", deleteMessages)
app.get("/api/online-status/:userId", checkUserOnline)
app.post('/api/upload', upload.single('file'), uploadImages)



const port = process.env.PORT || 5000;
server.listen(port, () => {
    connectDB()
    console.log('server started at http://localhost:5000 ...')
})

