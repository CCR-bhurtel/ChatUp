import Button from '@/components/reusables/Button';
import Input from '@/components/reusables/Input';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import google from '../../assets/icons/google.png';
import facebook from '../../assets/icons/facebook.png';
import Link from 'next/link';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { AuthActionTypes } from '@/context/auth/authActions';
import toast from 'react-hot-toast';
import axios, { AxiosResponse } from 'axios';
import { IUserType } from '@/Types/User';

function Login() {
    const [userData, setUserData] = useState<{ email?: string; password?: string }>({ email: '', password: '' });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const { state, dispatch } = useAuth();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            dispatch({
                type: AuthActionTypes.LoggingUser,
                payload: undefined,
            });
            const response: AxiosResponse<IUserType> = await axios.post('/auth/login', userData, {
                withCredentials: true,
            });
            const user = response.data;

            dispatch({ type: AuthActionTypes.LoadUser, payload: user });
            toast.success('User logged in successfully');
        } catch (err: any) {
            dispatch({ type: AuthActionTypes.UserLoginFail, payload: undefined });
            toast.error(err?.response?.data.message || 'Error loggin in user');
        }
        try {
        } catch (err) {}
    };
    return (
        <div className="w-screen h-[80vh] flex items-center justify-center">
            <form
                autoComplete="off"
                onSubmit={handleSubmit}
                className="min-w-[300px] flex flex-col items-center justify-center"
            >
                <h2 className="text-white text-3xl font-jk tracking-wide">login</h2>

                <div className="inputGroups mt-4 w-full">
                    <Input
                        value={userData.email}
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleInputChange}
                    />
                    <Input
                        value={userData.password}
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleInputChange}
                    />
                    <p className="text-gray-200 font-light text-sm mt-4 text-center">
                        <Link href="/auth/forgotpassword">Forgot password?</Link>
                    </p>
                </div>
                <div className="buttonGroup mt-2 w-full flex flex-col items-center justify-center">
                    <Button onClick={() => {}} dClass={'text-white bg-secondary hover:bg-primary'}>
                        login
                    </Button>
                    <h1 className="text-white mt-2 ">OR</h1>
                    <Button onClick={() => {}} dClass="text-white bg-red hover:bg-crimson">
                        <img src={google.src} alt="googleicon" className="w-8 mr-2" /> Login with google
                    </Button>
                    <Button onClick={() => {}} dClass="text-black bg-white hover:bg-black hover:text-white">
                        <img src={facebook.src} alt="facebookicon" className="w-8 mr-2" /> Login with facebook
                    </Button>
                </div>
                <p className="text-gray-200 font-light text-sm mt-4">
                    <Link href="/auth/signup">Don't have account? Signup</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
