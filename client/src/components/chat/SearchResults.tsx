import React, { useMemo } from "react";
import Avatar from "../reusables/Avatar";
import Loading from "../reusables/Loading";
import getAvatarImage from "@/utils/getAvatarImage";

import { IRoomType, ISimpleRoom } from "@/Types/Room";
import { useRouter } from "next/router";

import axios, { AxiosResponse } from "axios";
import { useAuth } from "@/context/auth/AuthContextProvider";
import toast from "react-hot-toast";
import { getSocket } from "@/utils/socketService";
import { useRoom } from "@/context/chat/RoomContextProvider";
import { RoomActionTypes } from "@/context/chat/roomActions";

interface ISearchResult {
  results: IRoomType[];
  loading: boolean;
  handleEmptySearchKey: () => void;
}
function SearchResult({
  results,
  loading,
  handleEmptySearchKey,
}: ISearchResult) {
  const router = useRouter();
  const auth = useAuth();
  const roomC = useRoom();

  let socket = useMemo(() => getSocket(), []);

  const handleItemClick = async (id: string, isGroupChat: boolean) => {
    handleEmptySearchKey();
    if (isGroupChat) {
      router.push(`/chat/${id}`);
    } else {
      try {
        const res: AxiosResponse<{ isNew: boolean; room: ISimpleRoom }> =
          await axios.post("/room", {
            users: [id, auth.state.user?._id],
            isGroupChat: false,
          });
        const room = res.data.room;

        if (res.data.isNew) {
          socket.emit("newRoom", room, auth.state.user?._id);
          roomC.dispatch({ type: RoomActionTypes.AppendRoom, payload: room });
        }

        router.push(`/chat/${room._id}`);
      } catch (err: any) {
        toast.error(err.response?.data.message || "Error getting chats");
      }
    }
  };

  return (
    <div className="mt-8 mb-12 w-full h-full overflow-y-scroll no-scrollbar overflow-x-hidden">
      <div className="rooms  max-h-full flex gap-2 flex-col w-full md:pb-0">
        {loading ? (
          <Loading />
        ) : !results.length ? (
          <h2>No search results</h2>
        ) : (
          results.map((room, i) => (
            <div className="w-full h-full" key={room._id}>
              <div
                onClick={() => handleItemClick(room._id, room.isGroupChat)}
                className="w-full h-full block"
              >
                <div className="cursor-pointer roomItem flex items-center justify-between flex-row p-2 m-2 bg-Gravel rounded-md">
                  <div className="messageDetails flex flex-row gap-2 items-center">
                    <Avatar
                      source={
                        room.isGroupChat
                          ? getAvatarImage(room.roomImage, true)
                          : getAvatarImage(room.roomImage, false)
                      }
                      className="h-[60px] w-[60px] "
                    />
                    <div
                      className={`messageContent ${
                        true ? "text-gray-400" : "text-white"
                      }`}
                    >
                      <h2 className="text-md font-medium">{room.roomName}</h2>
                      {room.isGroupChat ? (
                        <p>
                          {room.lastMessage &&
                            `${
                              room.lastMessage?.sender?.name
                            } : ${room.lastMessage.textContent?.substring(
                              0,
                              20
                            )}`}
                        </p>
                      ) : (
                        <p className="text-sm font-light"></p>
                      )}
                    </div>
                  </div>
                  {/* {room.sender.online ? (
                                    <div className="onlinestatus rounded-full w-2 h-2 bg-primary"></div>
                                ) : (
                                    ''
                                )} */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchResult;
