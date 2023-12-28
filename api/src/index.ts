/* eslint-disable import/first */

import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import connectDb from './database/connect';
import { JWT_SECRET, PORT } from './config/keys';

import socketio, { Socket } from 'socket.io';
import { IUser, PopulatedUser } from './Types/User';
import { IPopulatedChat } from './Types/Chat';
import { IRoom } from './Types/Room';
import { formatRoomDetail } from './utils/formatRoomDetails';

import jwt from 'jsonwebtoken';

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

let onlineUsers: { [key: string]: string } = {}; // stores {userId:socketId}

const isOnline = (userId: string): boolean => onlineUsers.hasOwnProperty(userId);

const getUserIdWithSocketID = (socketId: string): string | void => {
    const entry = Object.entries(onlineUsers).find((entry) => entry[1] === socketId);

    if (entry) return entry[0];
    return;
};

interface IOnlineStatus {
    userId: string;
    online: boolean;
}

const handleSocketEnd = (socket: Socket) => {
    const userId = getUserIdWithSocketID(socket.id);
    if (userId) {
        delete onlineUsers[userId];

        socket.rooms.forEach((room) => {
            socket.in(room).emit('useroffline', userId);
        });
    }
};

io.use((socket: Socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Unauthorized: Token not provided'));
        }

        const decodedUser: any = jwt.verify(token, JWT_SECRET);
        if (!decodedUser) return next(new Error('Unauthorized:Invalid token'));

        next();
    } catch (err) {
        return next(new Error('Unauthorized:Invalid token'));
    }
});

io.on('connection', (socket: Socket) => {
    socket.on('initialSetup', (userId: string) => {
        if (userId && !isOnline(userId)) onlineUsers[userId] = socket.id;
        const id = userId.toString();
        socket.join(id);
        socket.to(id).emit('joinself');
        socket.emit('onlineUsersReceived', onlineUsers);
    });

    socket.on('joinRoom', (roomId: string) => {
        // leaveAllRooms(socket, userId);

        socket.join(roomId.toString());
    });

    socket.on('leaveRoom', (roomId: string) => {
        socket.leave(roomId);
    });
    socket.on('typing', ({ room, profilePic, userId }) => {
        // if (socket.id === socketId) return;

        socket.to(room._id.toString()).emit('typing', { userId: userId, profilePic: profilePic });
        
    });

    socket.on('stopTyping', ({ roomId, userId }) => socket.in(roomId).emit('stopTyping', userId));

    socket.on('newMessage', (message: IPopulatedChat, socktId: any) => {
        const room = message.room;
        console.log(Array.from(socket.rooms));

        const senderId = message.sender._id.toString();

        socket.to(room._id.toString()).emit('roomMessageReceived', message);
        room.users.forEach((user) => {
            if (user._id.toString() == senderId) return;

            socket.to(user._id).emit('messageReceived', message);
        });
    });

    socket.on('newRoom', async (room: IRoom, userId: string) => {
        if (room.isGroupChat) {
            room.users.forEach((user) => {
                const id = user._id.toString();

                socket.to(id).emit('newRoomCreated', room);
            });
        } else {
            const otherUser = room.users.find((user) => user._id.toString() !== userId);

            if (otherUser) {
                const idInString = otherUser._id.toString();
                const formattedRoom = await formatRoomDetail(room, idInString);
                socket.to(idInString).emit('newRoomCreated', formattedRoom);
            }
        }
    });

    socket.on('getOnlineStatus', (userIds?: string[]) => {
        let activeUsers: string[] = [];
        if (userIds) {
            activeUsers = userIds.filter((userId) => isOnline(userId));
        }

        socket.emit('onlineStatusReceived', Object.keys(onlineUsers));
    });

    socket.on('disconnect', () => handleSocketEnd(socket));

    socket.on('end', () => handleSocketEnd(socket));
    socket.off('setup', (userData: IUser) => {
        console.log('User disconnected');
        socket.leave(userData._id);
    });
});
