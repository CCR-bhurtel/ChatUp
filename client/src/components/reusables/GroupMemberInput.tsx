import React, { ChangeEvent } from 'react';
import { IUser } from '../chat/CreateGroupChat';
import Input from './Input';

interface IGroupMemberInput {
    members: IUser[];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    removeMember: (user: IUser) => void;
    searchKey: string;
}
function GroupMemberInput(props: IGroupMemberInput) {
    return (
        <div className="w-full flex flex-col ">
            {props.members.length ? (
                <div className="memberlist flex flex-wrap flex-row max-w-full justify-start gap-2 mt-4">
                    {props.members.map((member) => (
                        <div key={member._id} className="bg-Gravel rounded-md text-white p-2 pt-4 pr-4 text-xs font-light relative">
                            <div
                                onClick={() => {
                                    props.removeMember(member);
                                }}
                                className="cross rounded-full flex items-center justify-center w-[10px] h-[10px] font-semibold bg-white absolute top-1 right-1 text-xs text-Gravel"
                            >
                                X
                            </div>
                            {member.name}
                        </div>
                    ))}
                </div>
            ) : (
                ''
            )}

            <Input
                onChange={props.onChange}
                name="users"
                value={props.searchKey}
                type="text"
                borderclass="border-navy focus:border-blue-400 disabled"
                placeholder="Group members"
            />
        </div>
    );
}

export default GroupMemberInput;
