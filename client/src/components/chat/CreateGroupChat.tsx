import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Input from "../reusables/Input";
import Button from "../reusables/Button";
import Avatar from "../reusables/Avatar";
import GroupMemberInput from "../reusables/GroupMemberInput";
import { IUserType } from "@/Types/User";
import axios, { AxiosResponse } from "axios";
import { useRoom } from "@/context/chat/RoomContextProvider";
import { BASE_PATH } from "@/config/keys";

export interface IUser {
  _id: string;
  name: string;
  profilePic: string;
}
interface ICreateGroupChat {
  onSubmit: (userIds: string[], grouName: string) => void;
}
function CreateGroupChat({ onSubmit }: ICreateGroupChat) {
  const [searchResult, setSearchResult] = useState<IUser[]>([]);

  const [groupName, setGroupName] = useState("");

  const [groupMembers, setGroupMembers] = useState<IUser[]>([]);

  const [searchKey, setSearchKey] = useState<string>("");

  const [openSearchResult, setOpenSearchResult] = useState<boolean>(false);

  const appendMember = (user: IUser) => {
    const existinguser = groupMembers.find((member) => member._id === user._id);
    if (!existinguser) {
      setGroupMembers([...groupMembers, user]);
      setOpenSearchResult(false);
      setSearchKey("");
    }
  };

  const removeGroupMember = (user: IUser) => {
    const newMembers = groupMembers.filter((member) => member._id !== user._id);
    setGroupMembers(newMembers);
  };

  const handleMemberInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);

    try {
      const res: AxiosResponse<{ users: IUser[] }> = await axios.post(
        `/room/usersearch?key=${searchKey}`,
        {
          selectedUsers: groupMembers.map((member) => member._id),
        },
        { withCredentials: true }
      );
      const newSearchResults = res.data.users;
      if (newSearchResults.length) {
        setOpenSearchResult(true);
      }
      setSearchResult(newSearchResults);
    } catch (err) {}
  };

  useEffect(() => {
    try {
      const groupContainer = document.getElementById("chatGroupCreate");
      const searchResult = document.getElementById("groupMemberContainer");

      groupContainer?.addEventListener("click", (e: any) => {
        setTimeout(() => {
          if (openSearchResult && !searchResult?.contains(e.target)) {
            setOpenSearchResult(false);
          }
        }, 100);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div
      id="chatGroupCreate"
      className="bg-Iron py-12 px-4 flex flex-col min-w-[20rem] rounded-md"
    >
      <div className="sectiontitle font-jk font-normal text-center tracking-wide text-2xl text-navy">
        create chat group
      </div>
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(
            groupMembers.map((member) => member._id),
            groupName
          );
        }}
      >
        <Input
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
          value={groupName}
          name="roomName"
          type="text"
          borderclass="border-navy focus:border-blue-400 text-navy"
          placeholder="Name"
        />

        <div
          id="groupMemberContainer"
          className="groupMemberContainer relative"
        >
          <GroupMemberInput
            searchKey={searchKey}
            removeMember={removeGroupMember}
            members={groupMembers}
            onChange={handleMemberInputChange}
          />

          {searchResult.length && openSearchResult ? (
            <div className="groupSearchResult bg-white p-2 flex flex-col rounded-md gap-1 absolute w-full">
              {searchResult.map((member) => (
                <div
                  key={member._id}
                  onClick={() => {
                    appendMember(member);
                  }}
                  className="member flex  items-center justify-center bg-Gravel p-2 rounded-md w-full cursor-pointer"
                >
                  <Avatar
                    source={`${BASE_PATH}/images/userImages/${member.profilePic}`}
                    className="w-[30px] h-[30px]"
                  />
                  <p className="ml-2 text-md text-white">{member.name}</p>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>

        <Button
          dClass="bg-navy hover:bg-secondary text-white rounded-md mt-8"
          onClick={() => {}}
        >
          <p>Submit</p>
        </Button>
      </form>
    </div>
  );
}

export default CreateGroupChat;
