const express = require('express')
const cors = require('cors')
const connectDB = require('./db');
require('dotenv').config();
const { Server } = require("socket.io")
const { createServer } = require('http')


// routes
const usersRoute = require('./routes/usersRoute');
const productsRoute = require('./routes/productsRoute');
const shopsRoute = require('./routes/shopsRoute');
const orderRoute = require('./routes/ordersRoute');
const conversationsRoute = require('./routes/conversationsRoute');
const messagesRoute = require('./routes/messagesRoute');
const analyticsRoute = require('./controllers/analyticsController')



const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on('connection', (socket) => {
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users)
    })

    socket.on("sendMessage", ({ senderId, receiverId, text, type }) => {
        const user = getUser(receiverId)
        if (user) {
            io.to(user.socketId).emit("sendMessage", {
                senderId,
                text,
                type,
            })
        }
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
});

// Connect to MongoDB
connectDB();

const PORT = 4000;

app.use(cors())
app.use(express.json())

// Use products route
app.use('/api/users', usersRoute);

// Use products route
app.use('/api/products', productsRoute);

//Use shops route
app.use('/api/shops', shopsRoute);

//Use orders route
app.use('/api/orders', orderRoute);

//Use analytics route
app.use('/api/analytics', analyticsRoute);

// chat
app.use('/api/conversations', conversationsRoute);

app.use('/api/messages', messagesRoute);




server.listen(PORT, () => {
    console.log(`server on port ${PORT}`)
})




