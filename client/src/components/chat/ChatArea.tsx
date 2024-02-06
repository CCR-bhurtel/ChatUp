import {
  faPhone,
  faTrashCan,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  SyntheticEvent,
  createRef,
  useEffect,
  useMemo,
  useState,
  useRef,
  Reference,
  RefObject,
} from "react";
import Avatar from "../reusables/Avatar";
import { IActiveRoom } from "@/Types/Room";
import getAvatarImage from "@/utils/getAvatarImage";
import MessageContainer from "./MessageContainer";
import { IChatType } from "@/Types/Chat";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "@/context/auth/AuthContextProvider";
import { useRoom } from "@/context/chat/RoomContextProvider";
import { RoomActionTypes } from "@/context/chat/roomActions";
import toast from "react-hot-toast";
import { getSocket } from "@/utils/socketService";
import MessageInput from "./MessageInput";
import TypingContainer from "./TypingContainer";
import { IUserType } from "@/Types/User";

interface IChatArea {
  handleInfoOpen: () => void;
  room: IActiveRoom;
}

export interface TypingUser {
  userId: string;
  profilePic: string;
  roomId: string;
}

function ChatArea(props: IChatArea) {
  const { room } = props;
  const auth = useAuth();
  const { state, dispatch } = useRoom();
  const divref = createRef<HTMLDivElement>();

  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const socket = useMemo(() => getSocket(), []);
  useEffect(() => {
    if (divref.current) {
      divref.current.scrollTo({
        top: divref.current.scrollHeight + 30,
        behavior: "smooth",
      });
    }
  }, [state.activeRoom?.messages, typingUsers]);
  const roomImage = useMemo(
    () => getAvatarImage(room.roomImage, room.isGroupChat),
    [room]
  );

  const handleSendMessage = async (
    e: SyntheticEvent,
    message?: string,
    images?: File[],
    inputRef?: RefObject<HTMLInputElement>,
    resetPrevImages?: () => void
  ) => {
    e.preventDefault();

    if (!auth.state.user) {
      toast.error("User not authorized");
      return;
    }
    if (images?.length) {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("files", image);
      });
      if (message?.length) {
        formData.append("message", message);
      }
      formData.append("roomId", room._id);

      try {
        const res: AxiosResponse<IChatType[]> = await axios.post(
          "/chat/imagemessage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res.data);
        let chats = res.data.map((chat) => ({
          ...chat,
          sender: auth.state.user as IUserType,
        }));

        if (inputRef?.current) {
          inputRef.current.value = "";
          inputRef.current.type = "text";
          inputRef.current.type = "file";
        }
        if (resetPrevImages) resetPrevImages();

        chats.forEach((chat) => {
          dispatch({ type: RoomActionTypes.AppendChatToRoom, payload: chat });
          dispatch({ type: RoomActionTypes.UpdateLastMessage, payload: chat });

          socket.emit("newMessage", { ...chat, room: state.activeRoom });
        });
      } catch (err) {}
    } else {
      if (!message) return;
      try {
        const res: AxiosResponse<IChatType> = await axios.post("/chat", {
          message,
          roomId: room._id,
        });

        let chat = {
          ...res.data,
          sender: auth.state.user,
        };

        dispatch({ type: RoomActionTypes.AppendChatToRoom, payload: chat });
        dispatch({ type: RoomActionTypes.UpdateLastMessage, payload: chat });

        socket.emit("newMessage", { ...chat, room: state.activeRoom });
      } catch (err: any) {
        toast.error(err.response?.data.message);
      }
    }
  };

  useEffect(() => {
    socket.on("typing", (typingUser: TypingUser) => {
      const existingUser = typingUsers.find(
        (user) => user.userId === typingUser.userId
      );
      if (!existingUser && typingUser.roomId === state.activeRoom?._id) {
        setTypingUsers((typingUsers) => typingUsers.concat(typingUser));
      }
    });
    socket.on("stopTyping", (userId: string) => {
      const newTypingUsers = typingUsers.filter(
        (user) => user.userId !== userId
      );
      setTypingUsers((typingUsers) => newTypingUsers);
    });
    socket.on("roomMessageReceived", (message: IChatType) => {
      dispatch({ type: RoomActionTypes.AppendChatToRoom, payload: message });
    });
    return () => {
      setTypingUsers([]);
      socket.emit("stopTyping", {
        roomId: state.activeRoom?._id,
        userId: auth.state.user?._id,
      });
    };
  }, []);

  return (
    <div className="flex chatsection relative  flex-col h-full w-full">
      <div className="flex justify-between p-4 items-center">
        <div
          onClick={() => {
            props.handleInfoOpen();
          }}
          className="personinfo flex flex-row gap-2 items-center cursor-pointer"
        >
          <Avatar className="min-h-[50px] w-[50px]" source={roomImage} />
          <div className={`messageContent  text-white`}>
            <h2 className="text-md font-medium">{room.roomName}</h2>
            {/* <p className="text-xs font-thin -mt-1">online</p> */}
          </div>
        </div>
        <div className="buttons flex gap-4">
          <FontAwesomeIcon icon={faPhone} style={{ color: "white" }} />
          <FontAwesomeIcon icon={faVideoCamera} style={{ color: "white" }} />
          <FontAwesomeIcon icon={faTrashCan} style={{ color: "white" }} />
        </div>
      </div>
      <div
        ref={divref}
        className="max-h-[78%] mb-20 overflow-y-scroll no-scrollbar flex flex-col flex-1 w-full"
      >
        <div className="flex p-4  flex-1 min-w-full">
          <div className="message-container w-full py-2 overflow-y-scroll no-scrollbar overflow-x-hidden flex flex-col">
            <MessageContainer messages={room.messages} />
            <TypingContainer users={typingUsers} />
          </div>
        </div>
        <MessageInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatArea;
