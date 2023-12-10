import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import Input from '../reusables/Input';
import Button from '../reusables/Button';
import Avatar from '../reusables/Avatar';
import GroupMemberInput from '../reusables/GroupMemberInput';

export interface IUser {
    _id: string;
    name: string;
    profilePic: string;
}
interface ICreateGroupChat {
    onSubmit: () => void;
}
function CreateGroupChat({ onSubmit }: ICreateGroupChat) {
    const [availableUsers, setAvailableusers] = useState<IUser[]>([
        {
            _id: 'fdasdfl12342',
            profilePic:
                'https://images.unsplash.com/photo-1610276198568-eb6d0ff53e48?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Elizabeth II',
        },
        {
            _id: 'fdasdfl12343',

            profilePic:
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG90cmFpdHxlbnwwfHwwfHx8MA%3D%3D',
            name: 'Neil patrick',
        },

        {
            _id: 'fdasdfl12344',

            profilePic:
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG90cmFpdHxlbnwwfHwwfHx8MA%3D%3D',
            name: 'John Doe',
        },
        {
            _id: 'fdasdfl12345',

            profilePic:
                'https://images.unsplash.com/photo-1610276198568-eb6d0ff53e48?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Lily',
        },
        {
            _id: 'fdasdfl12346',

            name: 'Nick',
            profilePic:
                'https://images.unsplash.com/photo-1552234994-66ba234fd567?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG90cmFpdHxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
            _id: 'fdasdfl12347',

            profilePic:
                'https://images.unsplash.com/photo-1610276198568-eb6d0ff53e48?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Robin',
        },
    ]);
    const [searchResult, setSearchResult] = useState<IUser[]>([]);

    const [groupMembers, setGroupMembers] = useState<IUser[]>([]);

    const [searchKey, setSearchKey] = useState<string>('');

    const [openSearchResult, setOpenSearchResult] = useState<boolean>(false);

    const appendMember = (user: IUser) => {
        const existinguser = groupMembers.find((member) => member._id === user._id);
        if (!existinguser) {
            setGroupMembers([...groupMembers, user]);
            setOpenSearchResult(false);
            setSearchKey('');
        }
    };

    const removeGroupMember = (user: IUser) => {
        const newMembers = groupMembers.filter((member) => member._id !== user._id);
        setGroupMembers(newMembers);
    };

    const handleMemberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value);
        const newSearchResults = availableUsers.filter(
            (result) => e.target.value.length && result.name.toLowerCase().startsWith(e.target.value.toLowerCase())
        );
        if (newSearchResults.length) {
            setOpenSearchResult(true);
        }
        setSearchResult(newSearchResults);
    };

    useEffect(() => {}, [searchKey]);
    return (
        <div className="bg-Iron py-12 px-4 flex flex-col min-w-[20rem] rounded-md">
            <div className="sectiontitle font-jk font-normal text-center tracking-wide text-2xl text-navy">
                create chat group
            </div>
            <form>
                <Input
                    onChange={() => {}}
                    name="roomName"
                    type="text"
                    borderclass="border-navy focus:border-blue-400 text-navy"
                    placeholder="Name"
                />

                <div className="membercontiner relative">
                    <GroupMemberInput
                        searchKey={searchKey}
                        removeMember={removeGroupMember}
                        members={groupMembers}
                        onChange={handleMemberInputChange}
                    />

                    {searchResult.length && openSearchResult ? (
                        <div className="seachResult bg-white p-2 flex flex-col rounded-md gap-1 absolute w-full">
                            {searchResult.slice(0, 5).map((member) => (
                                <div
                                    onClick={() => {
                                        appendMember(member);
                                    }}
                                    className="member flex  items-center justify-center bg-Gravel p-2 rounded-md w-full"
                                >
                                    <Avatar source={member.profilePic} className="w-[30px] h-[30px]" />
                                    <p className="ml-2 text-md text-white">{member.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        ''
                    )}
                </div>

                <Button
                    dClass="bg-navy hover:bg-secondary text-white rounded-md mt-8"
                    onClick={() => {
                        onSubmit();
                    }}
                >
                    <p>Submit</p>
                </Button>
            </form>
        </div>
    );
}

export default CreateGroupChat;
