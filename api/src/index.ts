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

io.on('connection', (socket) => {
    socket.on('initialSetup', (userId: string) => {
        if (userId && !isOnline(userId)) onlineUsers[userId] = socket.id;

        socket.join(userId);
        socket.to(userId).emit('joinself');
        socket.emit('onlineUsersReceived', onlineUsers);
    });

    socket.on('joinRoom', (roomId: string, userId: string) => {
        // leaveAllRooms(socket, userId);

        socket.join(roomId.toString());
    });

    socket.on('leaveRoom', (roomId: string) => {
        socket.leave(roomId);
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

            if (otherUser) {
                const idInString = otherUser._id.toString();
                const formattedRoom = await formatRoomDetail(room, idInString);
                socket.to(idInString).emit('newRoomCreated', formattedRoom);
            }
        }
    });

    socket.on('getOnlineStatus', (userIds: string[]) => {
        const activeUsers: string[] = userIds.filter((userId) => isOnline(userId));

        socket.emit('onlineStatusReceived', Object.keys(onlineUsers));
    });

    socket.on('disconnect', () => handleSocketEnd(socket));

    socket.on('end', () => handleSocketEnd(socket));
    socket.off('setup', (userData: IUser) => {
        console.log('User disconnected');
        socket.leave(userData._id);
    });
});
