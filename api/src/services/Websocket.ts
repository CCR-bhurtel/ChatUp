import socketio, { Socket, Server } from "socket.io";
import parseCookieFromHeader from "../utils/parseCookieFromHeader";
import { JWT_SECRET } from "../config/keys";
import jwt from "jsonwebtoken";
import { IRoom } from "../Types/Room";
import { IChat, IPopulatedChat } from "../Types/Chat";
import { formatRoomDetail } from "../utils/formatRoomDetails";
import { IUser } from "../Types/User";
import { SocketType } from "dgram";

export default class WS {
  static io: Server;
  static onlineUsers: { [key: string]: string } = {};

  static getUserIdWithSocketID = (socketId: string): string | null => {
    const entry = Object.entries(WS.onlineUsers);
    const userEntry = entry.find((entry) => entry[1] === socketId);
    if (userEntry) {
      return userEntry[0];
    }
    return null;
  };

  static isUserOnline = (userId: string): boolean => {
    return WS.onlineUsers.hasOwnProperty(userId);
  };

  public sendOnlineUsersStatus(socket: Socket) {
    socket.broadcast.emit("onlineUsersReceived", Object.keys(WS.onlineUsers));
  }

  public createConnection(server: any, origin?: string) {
    WS.io = new socketio.Server(server, {
      cors: { origin },
      pingTimeout: 60000,
    });

    WS.io.use((socket: Socket, next) => {
      try {
        const token = parseCookieFromHeader(socket.handshake.headers.cookie);
        // const token = socket.handshake.auth.token;
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

    WS.io.on("connection", (socket: Socket) => {
      socket.on("initialSetup", (userId: string) => {
        if (userId && !WS.isUserOnline(userId))
          WS.onlineUsers[userId] = socket.id;
        const id = userId.toString();
        socket.join(id);
        socket.to(id).emit("joinself");
        this.sendOnlineUsersStatus(socket);
      });

      socket.on("joinRoom", (roomId: string) => {
        // leaveAllRooms(socket, (socket as any).user.userId);

        socket.join(roomId);
        this.sendOnlineUsersStatus(socket);
      });

      socket.on("leaveRoom", (roomId: string) => {
        socket.leave(roomId);
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

      socket.on("newMessage", (message: IPopulatedChat) => {
        const room = message.room;

        const senderId = message.sender._id.toString();
        const updatedMessage = { ...message, room: message.room._id };

        socket
          .to(room._id.toString())
          .emit("roomMessageReceived", updatedMessage);
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
          activeUsers = userIds.filter((userId) => WS.isUserOnline(userId));
        }

        socket.emit("onlineStatusReceived", Object.keys(WS.onlineUsers));
      });

      socket.on("updateRoom", (data: { room: IRoom; messages: [IChat] }) => {
        socket
          .to(data.room._id)
          .emit("newGroupUpdate", { ...data.room, messages: data.messages });
      });

      socket.on("disconnect", () => WS.handleSocketEnd(socket));

      socket.on("end", () => WS.handleSocketEnd(socket));
      socket.off("setup", (userData: IUser) => {
        socket.leave(userData._id);
        WS.handleSocketEnd(socket);
      });
    });
  }

  static handleSocketEnd = (socket: Socket) => {
    const userId = this.getUserIdWithSocketID(socket.id);

    if (userId) {
      delete WS.onlineUsers[userId];

      socket.rooms.forEach((room) => {
        socket.in(room).emit("useroffline", userId);
      });

      WS.io.emit("onlineUsersReceived", Object.keys(WS.onlineUsers));
    }
  };
}
