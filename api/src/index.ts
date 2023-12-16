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
    socket.on('initial', (userData: IUser) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
        console.log(`User joined room ${roomId}`);
    });
    socket.on('typing', (room, userImage) => socket.in(room).emit('typing', { userImage: userImage }));

    socket.on('stopTyping', (room) => socket.in(room).emit('stopTyping'));

    socket.on('newMessage', (message: IPopulatedChat) => {
        const room = message.room;

        room.users.forEach((user) => {
            if (user._id.toString() === message.sender._id) return;

            socket.in(user._id.toString()).emit('message received', message);
        });
    });

    socket.off('setup', (userData: IUser) => {
        console.log('User disconnected');
        socket.leave(userData._id);
    });
});
