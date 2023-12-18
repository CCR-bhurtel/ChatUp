/* eslint-disable import/first */

import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import connectDb from './database/connect';
import { PORT } from './config/keys';

import socketio, { Socket } from 'socket.io';
import { IUser } from './Types/User';
import { IPopulatedChat } from './Types/Chat';

connectDb()
    .then(() => {})
    .catch((err: any) => {
        console.log(err);
    });

const server = app.listen(PORT, () => {
    console.log(`app listening to port ${PORT}`);
});

const io = new socketio.Server(server, { cors: { origin: 'http://localhost:3000' }, pingTimeout: 60000 });

const leaveAllRooms = (socket: Socket, userId: string) => {
    const rooms = socket.rooms;
    rooms.forEach((room) => {
        if (room !== socket.id && room !== userId) {
            socket.leave(room);
        }
    });
};
io.on('connection', (socket) => {
    socket.on('initialSetup', (userData: IUser) => {
        socket.join(userData._id.toString());
        socket.emit('connected');
    });

    socket.on('joinRoom', (roomId: string, userId: string) => {
        leaveAllRooms(socket, userId);
        socket.join(roomId.toString());
    });
    socket.on('typing', ({ room, profilePic, userId }) => {
        // if (socket.id === socketId) return;

        socket.to(room._id.toString()).except(userId).emit('typing', { userId: userId, profilePic: profilePic });
    });

    socket.on('stopTyping', ({ roomId, userId }) => socket.in(roomId).except(userId).emit('stopTyping', userId));

    socket.on('newMessage', (message: IPopulatedChat, socktId: any) => {
        const room = message.room;
        if (socktId === socket.id) return;
        socket.to(room._id.toString()).emit('messageReceived', { ...message, room: message.room._id });
    });

    socket.off('setup', (userData: IUser) => {
        console.log('User disconnected');
        socket.leave(userData._id);
    });
});
