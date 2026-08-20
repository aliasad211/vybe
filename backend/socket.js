import http from "http";
import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";

//imports are evaluated before the importing module's body, so index.js calling
//dotenv.config() is too late for anything read at module level here
dotenv.config();

const app = express();
const server = http.createServer(app);

export const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
    cors: {
        origin: clientUrl,
        credentials: true
    }
});

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

//a room per user rather than a userId -> socketId map: a second tab used to
//overwrite the first, and closing either one then marked the user offline and
//cut off both
const onlineUsers = () => {
    const { rooms, sids } = io.sockets.adapter;
    //every socket also sits in a room named after its own id — those are not users
    return [...rooms.keys()].filter(room => !sids.has(room));
}

//delivers to every tab the user has open, and is a no-op when they are offline
export const emitToUser = (userId, event, payload) => {
    io.to(userId.toString()).emit(event, payload);
}

io.on("connection", (socket) => {
    socket.join(socket.userId);
    io.emit("getOnlineUsers", onlineUsers());

    //"disconnect" fires after the socket has left its rooms, so the user's room
    //is only gone once their last tab has closed
    socket.on("disconnect", () => {
        io.emit("getOnlineUsers", onlineUsers());
    });
});

export { app, server, io };
