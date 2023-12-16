import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initSocket = () => {
    socket = io('ws://localhost:8000');

    socket.on('connect', () => {
        console.log('socket connected');
    });

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });

    return socket;
};

export const getSocket = (): Socket => {
    return socket;
};
