/* eslint-disable import/first */

import dotenv from "dotenv";
import { PeerServer } from "peer";
dotenv.config();

import app from "./app";
import connectDb from "./database/connect";
import { CLIENT_URI, JWT_SECRET, PEER_SERVER_PORT, PORT } from "./config/keys";

import socketio, { Server, Socket } from "socket.io";
import { IUser, PopulatedUser } from "./Types/User";
import { IChat, IPopulatedChat } from "./Types/Chat";
import { IRoom } from "./Types/Room";
import { formatRoomDetail } from "./utils/formatRoomDetails";

import jwt from "jsonwebtoken";
import swagger from "./swagger";

connectDb()
  .then(() => {})
  .catch((err: any) => {
    console.log(err);
  });

swagger(app);
let server = app.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});
let peerServer = PeerServer({ port: PEER_SERVER_PORT }, () => {
  console.log(`Peer server running in port ${PEER_SERVER_PORT}`);
});
peerServer.on("connection", (peer) => {});
const io = new socketio.Server(server, {
  cors: { origin: CLIENT_URI },
  pingTimeout: 60000,
});

const leaveAllRooms = (socket: Socket, userId: string) => {
  const rooms = socket.rooms;
  rooms.forEach((room) => {
    if (room !== socket.id && room !== userId) {
      socket.leave(room);
    }
  });
};

let onlineUsers: { [key: string]: string } = {}; // stores {userId:socketId}

const isOnline = (userId: string): boolean =>
  onlineUsers.hasOwnProperty(userId);

const getUserIdWithSocketID = (socketId: string): string | void => {
  const entry = Object.entries(onlineUsers);
  const userEntry = entry.find((entry) => entry[1] === socketId);
  if (userEntry) {
    return userEntry[0];
  }
};

interface IOnlineStatus {
  userId: string;
  online: boolean;
}

const handleSocketEnd = (
  socket: Socket,
  io: Server | undefined = undefined
) => {
  const userId = getUserIdWithSocketID(socket.id);

  if (userId) {
    delete onlineUsers[userId];

    socket.rooms.forEach((room) => {
      socket.in(room).emit("useroffline", userId);
    });
    if (io) {
      io.emit("onlineUsersReceived", Object.keys(onlineUsers));
    }
  }
};

io.use((socket: Socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Unauthorized: Token not provided"));
    }

    const decodedUser: any = jwt.verify(token, JWT_SECRET);
    if (!decodedUser) return next(new Error("Unauthorized:Invalid token"));
    (socket as any).user = decodedUser;
    next();
  } catch (err) {
    return next(new Error("Unauthorized:Invalid token"));
  }
});

io.on("connection", (socket: Socket) => {
  socket.on("initialSetup", (userId: string) => {
    console.log(userId);
    if (userId && !isOnline(userId)) onlineUsers[userId] = socket.id;
    const id = userId.toString();
    socket.join(id);
    socket.to(id).emit("joinself");
    socket.broadcast.emit("onlineUsersReceived", Object.keys(onlineUsers));
  });

  socket.on("joinRoom", (roomId: string) => {
    // leaveAllRooms(socket, (socket as any).user.userId);

    socket.join(roomId);
  });

  socket.on("leaveRoom", (roomId: string) => {
    socket.leave(roomId);
    // console.log(socket.rooms);
  });
  socket.on("typing", ({ roomId, profilePic, userId }) => {
    // if (socket.id === socketId) return;

    socket
      .to(roomId)
      .emit("typing", { roomId, userId: userId, profilePic: profilePic });
  });

  socket.on("stopTyping", ({ roomId, userId }) =>
    socket.to(roomId).emit("stopTyping", userId)
  );

  socket.on("newMessage", (message: IPopulatedChat, socktId: any) => {
    const room = message.room;

    const senderId = message.sender._id.toString();
    const updatedMessage = { ...message, room: message.room._id };

    socket.to(room._id.toString()).emit("roomMessageReceived", updatedMessage);
    room.users.forEach((user) => {
      if (user._id.toString() == senderId) return;

      socket.to(user._id).emit("messageReceived", updatedMessage);
    });
  });

  socket.on(
    "acknowledgeMessageRead",
    async (roomId: string, userId: string) => {}
  );

  socket.on("newRoom", async (room: IRoom, userId: string) => {
    if (room.isGroupChat) {
      room.users.forEach((user) => {
        const id = user._id.toString();

        socket.to(id).emit("newRoomCreated", room);
      });
    } else {
      const otherUser = room.users.find(
        (user) => user._id.toString() !== userId
      );

      if (otherUser) {
        const idInString = otherUser._id.toString();
        const formattedRoom = await formatRoomDetail(room, idInString);
        socket.to(idInString).emit("newRoomCreated", formattedRoom);
      }
    }
  });

  socket.on("getOnlineStatus", (userIds?: string[]) => {
    let activeUsers: string[] = [];
    if (userIds) {
      activeUsers = userIds.filter((userId) => isOnline(userId));
    }

    socket.emit("onlineStatusReceived", Object.keys(onlineUsers));
  });

  socket.on("updateRoom", (data: { room: IRoom; messages: [IChat] }) => {
    socket
      .to(data.room._id)
      .emit("newGroupUpdate", { ...data.room, messages: data.messages });
  });

  socket.on("disconnect", () => handleSocketEnd(socket, io));

  socket.on("end", () => handleSocketEnd(socket, io));
  socket.off("setup", (userData: IUser) => {
    console.log("User disconnected");
    socket.leave(userData._id);
    handleSocketEnd(socket);
  });
});
