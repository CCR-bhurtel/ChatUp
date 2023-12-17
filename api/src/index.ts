/* eslint-disable import/first */

import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import connectDb from './database/connect';
import { PORT } from './config/keys';
import { Server } from 'http';
import socketio from 'socket.io';
import { IUser } from './Types/User';
import { IPopulatedChat } from './Types/Chat';
let server: Server;

connectDb()
    .then(() => {
        console.log('Database connected');
    })
    .catch((err: any) => {
        console.log(err);
    });

server = app.listen(PORT, () => {
    console.log(`app listening to port ${PORT}`);
});

const io = new socketio.Server(server, { cors: { origin: 'http://localhost:3000' }, pingTimeout: 60000 });

io.on('connection', (socket) => {
    socket.on('initialSetup', (userData: IUser) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
        console.log(`User joined room ${roomId}`);
    });
    socket.on('typing', ({ room, profilePic, userId }) => {
        room.users.forEach((user: IUser) => {
            if (user._id === userId) return;
            socket.in(room._id).emit('typing', { userId: user._id, profilePic: profilePic });
        });
    });

    socket.on('stopTyping', ({ room, userId }) => socket.in(room).emit('stopTyping', userId));

    socket.on('newMessage', (message: IPopulatedChat, socktId: any) => {
        const room = message.room;
        if (socktId == socket.id) return;
        room.users.forEach((user) => {
            socket.in(user._id.toString()).emit('messageReceived', { ...message, room: message.room._id });
        });
    });

    socket.off('setup', (userData: IUser) => {
        console.log('User disconnected');
        socket.leave(userData._id);
    });
});
