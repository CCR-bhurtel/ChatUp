/* eslint-disable import/first */

import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import connectDb from './database/connect';
import { PORT } from './config/keys';

import socketio, { Socket } from 'socket.io';
import { IUser } from './Types/User';
import { IPopulatedChat } from './Types/Chat';
import { IRoom } from './Types/Room';
import { formatRoomDetail } from './utils/formatRoomDetails';
import { SocketAddress } from 'net';

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

let onlineUsers: any[] = []; // stores {socketId:userId} collection

const isOnline = (socketId: string) => {
    return onlineUsers.some((user) => Object.keys(user).includes(socketId));
};

const getUserIdWithSocketID = (socketId: string): string => {
    const user = onlineUsers.find((user) => Object.keys(user).includes(socketId));
    return user[socketId];
};

io.on('connection', (socket) => {
    socket.on('initialSetup', (userData: IUser) => {
        if (!isOnline(socket.id) && userData._id)
            onlineUsers.push({
                [socket.id]: userData._id,
            });
        console.log(onlineUsers);

        socket.join(userData._id.toString());
    });

    socket.on('joinRoom', (roomId: string, userId: string) => {
        // leaveAllRooms(socket, userId);
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

    socket.on('newRoom', async (room: IRoom, userId: string) => {
        if (room.isGroupChat) {
            room.users.forEach((user) => {
                const id = user._id.toString();

                socket.to(id).emit('newRoomCreated', room);
            });
        } else {
            const otherUser = room.users.find((user) => user._id.toString() !== userId);
            console.log(otherUser);
            if (otherUser) {
                const idInString = otherUser._id.toString();
                const formattedRoom = await formatRoomDetail(room, idInString);
                socket.to(idInString).emit('newRoomCreated', formattedRoom);
            }
        }
    });

    socket.on('disconnect', () => {
        socket.rooms.forEach((room) => {
            socket.in(room).emit('useroffline', getUserIdWithSocketID(socket.id));
        });

        onlineUsers = onlineUsers.filter((onlineUser) => !onlineUser[socket.id]);
    });

    socket.off('setup', (userData: IUser) => {
        console.log('User disconnected');
        socket.leave(userData._id);
    });
});
