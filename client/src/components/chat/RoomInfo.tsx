import { IActiveRoom, IRoomType } from "@/Types/Room";
import React, { ChangeEvent, useState } from "react";
import Avatar from "../reusables/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBan,
  faImage,
  faPencil,
  faSearch,
  faUserFriends,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@material-tailwind/react";
import getAvatarImage from "@/utils/getAvatarImage";
import { useAuth } from "@/context/auth/AuthContextProvider";
import toast from "react-hot-toast";
import axios, { AxiosResponse } from "axios";
import { useRoom } from "@/context/chat/RoomContextProvider";
import { RoomActionTypes } from "@/context/chat/roomActions";
import { getSocket } from "@/utils/socketService";
import Popup from "../layouts/Popup";
import { useRouter } from "next/router";
import { IChatType } from "@/Types/Chat";
export interface IRoomInfo {
  room: IActiveRoom | undefined;
  light?: boolean;
}
function RoomInfo({ room, light }: IRoomInfo) {
  return (
    <div className={`container ${light ? "light" : "dark h-screen"}`}>
      <div
        className={`bg-white min-w-[20rem] dark:min-w-[25rem] dark:h-full dark:mt-12 p-4 rounded-md dark:rounded-none dark:bg-lightnavy flex items-center dark:items-start justify-center`}
      >
        {room?.isGroupChat ? (
          <RoomInfoGroup room={room} />
        ) : (
          <RoomInfoPrivate room={room} />
        )}
      </div>
      ;
    </div>
  );
}

export default RoomInfo;

function RoomInfoPrivate({ room }: IRoomInfo) {
  const roomImage = room ? getAvatarImage(room.roomImage) : "";
  return (
    <div className="flex flex-col min-h-[300px]  items-center justify-between">
      <div className="row1">
        <div className="userInfo flex items-center  flex-col">
          <Avatar source={roomImage} className="h-[80px] w-[80px]" />
          <div className="userinfo_data text-navy dark:text-white text-center mt-2">
            <h1 className=" font-semibold text-xl">{room?.roomName}</h1>
            <div className="address font-light text-sm">
              {room?.users[0].location}
            </div>
          </div>
        </div>
        <div className="useroptions mt-8 gap-2 flex flex-col items-start justify-center">
          {/* to be added later,
                Search Messages,
                Shared Media,
             */}
          <div className="seachMessage items-center gap-2 cursor-pointer text-navy dark:text-white flex flex-row">
            <FontAwesomeIcon icon={faSearch} />
            <span>Search messages</span>
          </div>{" "}
          <div className="sharedMedia items-center gap-2 cursor-pointer text-navy dark:text-white flex flex-row">
            <FontAwesomeIcon icon={faImage} />
            <span>Shared media</span>
          </div>
        </div>
      </div>

      {/* <span className="blockUser text-navy dark:text-white flex w-full justify-between">
        <div className="label">
          <FontAwesomeIcon icon={faBan} />
          <span> Block User</span>
        </div>
        <Switch
          containerProps={{
            className: "w-11 h-6",
          }}
          className="checked:bg-navy h-full w-full bg-transparent bg-slate-600"
          circleProps={{
            className: "before:hidden left-0.5 border-none bg-white ",
          }}
          crossOrigin={""}
        />
      </span> */}
    </div>
  );
}
function RoomInfoGroup({ room }: IRoomInfo) {
  const [newAdminId, setNewAdminId] = useState<string>("");
  const [isGroupLeaveOpen, setIsGroupLeaveOpen] = useState<boolean>(false);
  const auth = useAuth();
  const { dispatch } = useRoom();

  const router = useRouter();

  const handleGroupLeavePopupOpen = () => {
    setIsGroupLeaveOpen(true);
  };
  const handleGroupLeavePopupClose = () => {
    setIsGroupLeaveOpen(false);
  };

  const handleGroupLeave = async () => {
    const socket = getSocket();
    if (auth.state.user?._id == room?.roomAdmin && !newAdminId) {
      return toast.error("Please choose new admin");
    }
    try {
      const res: AxiosResponse<{ room: IRoomType; messages: [IChatType] }> =
        await axios.post(`room/group/${room?._id}/leave`, {
          newAdminUserId: newAdminId,
        });
      router.push("/chat");
      dispatch({ type: RoomActionTypes.LeaveActiveRoom });
      socket.emit("updateRoom", res.data);

      socket.emit("leaveRoom", room?._id);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error leaving group");
    }
  };
  const roomImage = room ? getAvatarImage(room.roomImage, true) : "";

  const handleRoomImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      try {
        const res: AxiosResponse<IRoomType> = await axios.put(
          `/room/image/${room?._id}`,
          formData
        );
        const image = res.data.roomImage;
        dispatch({ type: RoomActionTypes.EditRoomImage, payload: image });
      } catch (err: any) {
        toast.error(err.response?.data.message || "Eror updating image");
      }
    } else {
      toast.error("No Image file selected");
    }
  };
  return (
    <>
      {isGroupLeaveOpen ? (
        <Popup onClose={handleGroupLeavePopupClose}>
          <div className="min-w-[20rem] bg-white rounded-md flex flex-col p-4 ">
            <h2 className="font-jk text-3xl text-navy text-center">
              Leave room ?
            </h2>
            <p className="text-md text-center">
              You are a room admin. <br /> Please choose new admin before
              leaving.
            </p>
            <div className="flex gap-2 flex-col items-center justify-center mt-4">
              {room?.users.map((user) =>
                user._id !== room.roomAdmin ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Avatar
                        source={getAvatarImage(user.profilePic)}
                        className="h-[30px] w-[30px]"
                      />
                      <span className="text-md">{user.name}</span>
                    </div>

                    <input
                      onChange={() => {
                        setNewAdminId(user._id);
                      }}
                      type="radio"
                      name="newadminid"
                      className="w-40 accent-navy"
                    />
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
            <button
              onClick={handleGroupLeave}
              className="bg-primary p-2 mt-4 text-white transition-all hover:bg-slate-400"
            >
              Leave
            </button>
          </div>
        </Popup>
      ) : (
        ""
      )}
      <div className="flex dark:h-full flex-col min-h-[300px]  items-center ">
        <div className="row1">
          <div className="userInfo flex items-center  flex-col">
            <div className="relative">
              <Avatar
                source={roomImage}
                className="h-[80px] w-[80px] cursor-default"
              />
              {auth.state.user?._id === room?.roomAdmin ? (
                <div className="input cursor-pointer w-5 h-5 absolute top-0 right-0 text-navy">
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="absolute inset-0 text-navy dark:text-white"
                  />
                  <input
                    onChange={handleRoomImageChange}
                    type="file"
                    className="opacity-0"
                    accept="image/png, image/gif, image/jpeg, image/jpg, image/webp"
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="userinfo_data text-navy dark:text-white text-center mt-2">
              <h1 className=" font-semibold text-xl">{room?.roomName}</h1>
              <div className="address font-light text-sm">
                {room?.users.length} members
              </div>
            </div>
          </div>
          <div className="useroptions mt-8 gap-2 flex flex-col items-start justify-center">
            <div className="seachMessage items-center gap-2 cursor-pointer text-navy dark:text-white flex flex-row">
              <FontAwesomeIcon icon={faSearch} />
              <span>Search messages</span>
            </div>{" "}
            <div className="sharedMedia items-center gap-2 cursor-pointer text-navy dark:text-white flex flex-row">
              <FontAwesomeIcon icon={faImage} />
              <span>Shared media</span>
            </div>
          </div>
        </div>

        <span className="members flex-col mt-4 text-navy dark:text-white flex items-start w-full">
          <div className="sectiontitle">
            <FontAwesomeIcon icon={faUsers} />
            <span className="ml-2">Members</span>
          </div>
          <div className="memberlist mt-2 items-start w-full flex flex-col gap-2">
            {room?.users.slice(0, 5).map((user) => (
              <div
                key={user._id}
                className="groupmember rounded-md text-lightnavy dark:text-white cursor-pointer bg-gray-200  dark:bg-transparent p-2 w-full flex flex-row gap-2 items-center justify-between"
              >
                <div className="info flex flex-row gap-2 items-center text-sm">
                  <div className="avatar relative ">
                    <Avatar
                      source={getAvatarImage(user.profilePic)}
                      className="h-[30px] w-[30px] "
                    />

                    <div className="status absolute top-0 right-0 bg-primary w-2 h-2 rounded-full"></div>
                  </div>
                  <span>{user.name}</span>
                </div>
                <FontAwesomeIcon icon={faUserFriends} className="text-xs" />
              </div>
            ))}
          </div>
        </span>

        <span className="leavegroup  text-navy dark:self-end dark:text-white mt-4 flex w-full justify-between cursor-pointer">
          <span
            onClick={() => {
              if (
                room?.roomAdmin == auth.state.user?._id &&
                room?.users &&
                room?.users.length > 1
              ) {
                handleGroupLeavePopupOpen();
              } else {
                handleGroupLeave();
              }
            }}
          >
            Leave group
          </span>

          <div className="label">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </div>
        </span>
      </div>
    </>
  );
}
