import { IChatType } from "@/Types/Chat";
import { IActiveRoom, IRoomType, ISimpleRoom } from "@/Types/Room";
import ChatArea from "@/components/chat/ChatArea";
import RoomInfo from "@/components/chat/RoomInfo";
import Popup from "@/components/layouts/Popup";
import Loading from "@/components/reusables/Loading";
import { useAuth } from "@/context/auth/AuthContextProvider";
import { useRoom } from "@/context/chat/RoomContextProvider";
import { RoomActionTypes } from "@/context/chat/roomActions";
import { getSocket } from "@/utils/socketService";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import CreateGroupChat from "@/components/chat/CreateGroupChat";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatImageSlider from "@/components/chat/ChatImageSlider";

function ChatRoom() {
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const [isImageSliderOpen, setIsImageSliderOpen] = useState<boolean>(false);

  const router = useRouter();
  const { state, dispatch } = useRoom();
  const auth = useAuth();
  const [currentMedia, setCurrentMedia] = useState<string | undefined>();

  const handleImageSliderOpen = (id: string) => {
    setCurrentMedia(id);
    setIsImageSliderOpen(true);
  };

  const handleImageSliderClose = () => {
    setIsImageSliderOpen(false);
  };

  const handleCreateGroupOpen = () => {
    setCreateGroupOpen(true);
  };

  const handleCreateGroupClose = () => {
    setCreateGroupOpen(false);
  };

  const handleOpenInfo = () => {
    setIsInfoOpen(true);
  };
  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    return () => {
      socket.emit("leaveRoom", state.activeRoom?._id);
    };
  }, [router.query.roomid]);

  useEffect(() => {
    const activeRoomId = state.activeRoom?._id;
    const userId = auth.state.user?._id;
    dispatch({
      type: RoomActionTypes.UpdateLastMessageReadUsers,
      payload: { roomId: activeRoomId, userId: userId },
    });
    if (
      activeRoomId &&
      userId &&
      !state.activeRoom?.lastMessageReadBy.includes(userId)
    ) {
      axios
        .put(
          `/room/${activeRoomId}/lastmessage`,
          { userId },
          { withCredentials: true }
        )
        .then((res) => {})
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [state.activeRoom?.messages]);

  const handleRoomLoad = async () => {
    const { roomid } = router.query;
    if (!roomid) return;
    dispatch({ type: RoomActionTypes.ActiveRoomLoading });
    try {
      const res: AxiosResponse<{
        roomDetails: IRoomType;
        messages: IChatType[];
      }> = await axios.get(`/room/${roomid}`);
      const room: IActiveRoom = {
        ...res.data.roomDetails,
        messages: res.data.messages,
      };
      dispatch({ type: RoomActionTypes.SetActiveRoom, payload: room });

      socket.emit("joinRoom", room._id);
    } catch (err) {
      toast.error("Error loding room");
      router.push("/chat");
    }
  };

  const handleFormSubmit = async (userIds: string[], groupName: string) => {
    if (!groupName) {
      toast.error("Please enter valid room name");
      return;
    } else if (userIds.length < 1) {
      toast.error("Please enter any other member");
      return;
    }
    try {
      const res: AxiosResponse<{ message: string; group: ISimpleRoom }> =
        await axios.post(`/room`, {
          isGroupChat: true,
          groupName: groupName,
          users: userIds,
        });
      dispatch({ type: RoomActionTypes.AppendRoom, payload: res.data.group });
      toast.success(res.data.message);

      handleCreateGroupClose();
    } catch (err: any) {
      toast.error(err.response?.data.message || "Error creating group");
    }
  };

  useEffect(() => {
    handleRoomLoad();
    const background = document.querySelector(".backgroundlayer");
    if (background) {
      background.classList.toggle("hidden");
    }

    return () => {
      if (background) {
        background.classList.toggle("hidden");
      }
    };
  }, [router]);

  return (
    <div
      className={`w-full md:w-auto flex flex-col h-full overflow-hidden lg:self-stretch`}
    >
      <ChatImageSlider
        isSliderOpen={isImageSliderOpen}
        handleSliderClose={handleImageSliderClose}
        currentMediaId={currentMedia}
      />

      {createGroupOpen && (
        <Popup onClose={handleCreateGroupClose}>
          <CreateGroupChat onSubmit={handleFormSubmit} />
        </Popup>
      )}
      <div className="flex flex-row h-full  w-full">
        <div className="hidden lg:block lg:w-[25%] h-full ">
          <ChatSidebar handleGroupChatOpen={handleCreateGroupOpen} />
        </div>
        {state.isActiveRoomLoading ? (
          <Loading />
        ) : !state.activeRoom ? (
          <p></p>
        ) : (
          <>
            <div className="popup lg:hidden">
              {isInfoOpen ? (
                <Popup onClose={handleCloseInfo}>
                  <RoomInfo light={true} room={state.activeRoom} />
                </Popup>
              ) : (
                ""
              )}
            </div>

            <div className="flex-1">
              <ChatArea
                room={state.activeRoom}
                handleInfoOpen={handleOpenInfo}
                handleSliderOpen={handleImageSliderOpen}
              />
            </div>
            <div className="hidden lg:block">
              <RoomInfo light={false} room={state.activeRoom} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
