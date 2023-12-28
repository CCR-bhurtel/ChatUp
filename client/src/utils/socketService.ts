import { io, Socket } from 'socket.io-client';
import getCookie from './cookie';

let socket: Socket;

export const initSocket = () => {
    console.log('Authorization', getCookie('Authorization'));
    socket = io('ws://localhost:8000', {
        auth: {
            token: getCookie('Authorization'),
        },
    });

    socket.on('connect', () => {
        console.log('socket connected');
    });

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });

    return socket;
};

export const getSocket = (): Socket => {
    if (!socket) initSocket();
    return socket;
};
