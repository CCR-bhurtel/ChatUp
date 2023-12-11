import { IUserType } from '@/Types/User';
import Button from '@/components/reusables/Button';
import Input from '@/components/reusables/Input';
import { BASE_API_PATH } from '@/config/keys';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { AuthActionTypes } from '@/context/auth/authActions';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Resetpassword() {
    const [passwordData, setPasswordData] = useState<{ password: string; confirmPassword: string }>({
        password: '',
        confirmPassword: '',
    });

    const router = useRouter();

    const { dispatch } = useAuth();

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const formSubmitHandler = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (router.query?.token) {
                const res: AxiosResponse<IUserType> = await axios.post(
                    `${BASE_API_PATH}/auth/resetpassword?token=${router.query.token}`,
                    passwordData,
                    { withCredentials: true }
                );
                const user = res.data;
                dispatch({ type: AuthActionTypes.LoadUser, payload: user });
                toast.success('Password reset successfully');

                router.push('/chat');
            } else {
                // router.push('/auth/forgotpassword');
                toast.error('Invalid or expired token, please send email again.');
            }
        } catch (err: any) {
            toast.error(err?.response?.data.message || 'Error reseting password');
            router.push('/auth/forgotpassword');
        }
    };

    // useEffect(() => {
    //     if (!router.query.token || router.query?.token?.length < 5) {
    //         toast.error('Invalid token, please send email again');
    //         // router.push('/auth/forgotpassword');
    //     }
    // }, []);

    return (
        <div className="w-screen h-[80vh] flex items-center justify-center">
            <form onSubmit={formSubmitHandler} className="min-w-[300px] flex flex-col items-center justify-center">
                <h2 className="text-white text-3xl font-jk tracking-wide">reset password</h2>

                <div className="inputGroups mt-4 w-full">
                    <Input
                        type="password"
                        placeholder="password"
                        value={passwordData.password}
                        name="password"
                        onChange={inputChangeHandler}
                    />
                    <Input
                        type="password"
                        placeholder="confirm password"
                        value={passwordData.confirmPassword}
                        name="confirmPassword"
                        onChange={inputChangeHandler}
                    />
                </div>
                <div className="buttonGroup mt-8 w-full flex flex-col items-center justify-center">
                    <Button onClick={() => {}} dClass={'text-white bg-secondary transition-all hover:bg-primary'}>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Resetpassword;
