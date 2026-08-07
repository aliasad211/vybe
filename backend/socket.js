import http from "http";
import express from "express";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

//maps a logged in user's id to their active socket id
const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.use((socket, next) => {
    try {
        const cookies = parseCookie(socket.handshake.headers.cookie || "");
        const token = cookies.accessToken;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (error) {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io };
