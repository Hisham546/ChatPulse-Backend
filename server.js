import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import { Server } from 'socket.io';
import { createServer } from 'http';
import { register, fetchAllUsers, loginUser } from "./controllers/authController.js";

import { saveChats, getAllTexts } from "./controllers/chatsController.js";
dotenv.config();

const app = express()
app.use(express.json()) //allow accept json data in req.body

// Create an HTTP server and integrate Socket.IO with it
const server = createServer(app);
const io = new Server(server);

// When a client connects to the WebSocket
io.on('connection', (socket) => {
    console.log('a user connected');

    // Handle chat messages or other events here
    socket.on('chatMessage', async (message) => {
        console.log('Message received:', message);
        saveChats(message)
        try {

            // You can broadcast the message to all connected clients
            io.emit('chatMessage', message);
        } catch (error) {
            console.log(error)

        }


    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.post("/api/auth", register)
app.get("/api/users", fetchAllUsers)
app.post("/api/login", loginUser)
app.get("/api/user-chats", getAllTexts)

server.listen(5000, () => {
    connectDB()
    console.log('server started at http://localhost:5000 ...')
})

