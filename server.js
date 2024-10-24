import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import { Server } from 'socket.io';
import { createServer } from 'http';
import { register, fetchAllUsers, loginUser } from "./controllers/authController.js";

import { saveChats, getAllTexts, userOnline, checkUserOnline, deleteUserOnline } from "./controllers/chatsController.js";
dotenv.config();

const app = express()
app.use(express.json()) //allow accept json data in req.body

// Create an HTTP server and integrate Socket.IO with it
const server = createServer(app);
const io = new Server(server);
const onlineUsers = new Map();
// When a client connects to the WebSocket
io.on('connection', (socket) => {

    socket.on('userConnected', ({ userId }) => {
        console.log(`${userId} connected`);
    
        userOnline(userId);
        onlineUsers.set(socket.id, userId);
    });


    // Handle chat messages or other events here
    socket.on('chatMessage', async (message) => {
        console.log('Message received:', message);
        saveChats(message)
        try {

           //broadcast the message to all connected clients
            io.emit('chatMessage', message);
        } catch (error) {
            console.log(error)

        }


    });

    socket.on('disconnect', () => {
        const userId = onlineUsers.get(socket.id);
      
        deleteUserOnline(userId)
        console.log('user disconnected');
    });
});

app.post("/api/auth", register)
app.get("/api/users", fetchAllUsers)
app.post("/api/login", loginUser)
app.get("/api/user-chats", getAllTexts)
app.get("/api/online-status/:userId", checkUserOnline)

server.listen(5000, () => {
    connectDB()
    console.log('server started at http://localhost:5000 ...')
})

