import React, { useState } from "react";
import Avatar from "../reusables/Avatar";
import { IChatType } from "@/Types/Chat";
import { useAuth } from "@/context/auth/AuthContextProvider";
import getAvatarImage from "@/utils/getAvatarImage";
import { formatBasedOnDifference } from "@/utils/dateUtilChat";
import { BASE_PATH } from "@/config/keys";

export interface IMessageContainer {
  messages: IChatType[];
  handleSliderOpen: (id: string) => void;
}

function DateIndicator(props: { date: string }) {
  return (
    <span className="flex w-full mt-2 justify-center items-center">
      <span className="hr bg-gray-400 h-[1px]  w-full"></span>
      <span className="text-gray-400 text-sm w-full text-center">
        {props.date}
      </span>
      <span className="hr  bg-gray-400 h-[1px]  w-full"></span>
    </span>
  );
}

function MessageContainer(props: IMessageContainer) {
  const { state } = useAuth();
  return (
    <>
      {props.messages.map((message, i) => {
        const date = new Date(message.createdAt);

        const formattedTime = `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        const nextMessage = props.messages[i + 1];
        let dateIndicator: string | null = null;

        if (nextMessage) {
          const nextMessageDate = new Date(props.messages[i + 1].createdAt);
          dateIndicator = formatBasedOnDifference(nextMessageDate, date);
        }

        console.log(message);
        if (message.messageType == "Info") {
          return (
            <div className="text-gray-500 w-full text-center">
              {message.textContent}
            </div>
          );
        }
        if (message.sender._id === state.user?._id) {
          return (
            <>
              <div
                key={i}
                className="mymessages mt-2 self-end text-white font-light leading-tight  flex items-end flex-col gap-2 w-[70%]"
              >
                <div className="messages flex gap-2 flex-col">
                  <div
                    className={`message ${
                      message.messageType == "Text" && "bg-purple"
                    } p-4 pt-6 color-white rounded-md relative text-sm`}
                  >
                    <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                      {formattedTime}
                    </div>
                    {message.messageType === "Text" ? (
                      message.textContent
                    ) : (
                      <div
                        onClick={() => {
                          if (message.media?._id) {
                            props.handleSliderOpen(message.media?._id);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <img
                          className="max-h-[200px] max-w-[200px]  object-cover"
                          src={`${BASE_PATH}/static/images/chatImages/${message.media?.downloadUrl}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {dateIndicator && <DateIndicator date={dateIndicator} />}
            </>
          );
        } else {
          return (
            <>
              <div
                key={i}
                className="others mt-2 self-start text-white font-light leading-tight justify-start  flex items-end flex-row gap-2 w-[70%]"
              >
                <div
                  className={`avatardiv
                             ${
                               message.sender._id ===
                                 props.messages[i + 1]?.sender?._id &&
                               "opacity-0 pointer-events-none"
                             }`}
                >
                  <Avatar
                    className={`
                                    h-[25px] w-[25px]`}
                    source={getAvatarImage(message.sender.profilePic)}
                  />
                </div>
                <div
                  className={`message self-start ${
                    message.messageType == "Text" && "bg-storm"
                  } p-4 pt-6  color-white rounded-md relative text-sm`}
                >
                  <div className="time text-[10px] absolute left-1 top-1 p-1 font-thin tracking-wide">
                    {formattedTime}
                  </div>
                  {message.messageType === "Text" ? (
                    message.textContent
                  ) : (
                    <div
                      onClick={() => {
                        if (message.media?._id) {
                          props.handleSliderOpen(message.media?._id);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <img
                        className="max-h-[200px] max-w-[200px]  object-cover"
                        src={`${BASE_PATH}/static/images/chatImages/${message.media?.downloadUrl}`}
                      />
                    </div>
                  )}
                </div>
              </div>
              {dateIndicator && <DateIndicator date={dateIndicator} />}
            </>
          );
        }
      })}
    </>
  );
}

export default MessageContainer;
