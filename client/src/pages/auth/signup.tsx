import Button from '@/components/reusables/Button';
import Input from '@/components/reusables/Input';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import google from '../../assets/icons/google.png';
import facebook from '../../assets/icons/facebook.png';
import Link from 'next/link';
import axios, { AxiosResponse } from 'axios';
import { IUserType } from '@/Types/User';
import { AuthActionTypes } from '@/context/auth/authActions';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/auth/AuthContextProvider';

function Signup() {
    const [userData, setUserdata] = useState<{ name: string; email: string; password: string }>({
        name: '',
        email: '',
        password: '',
    });

    const { dispatch } = useAuth();
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserdata({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            const res: AxiosResponse<IUserType> = await axios.post('/auth/signup', userData, { withCredentials: true });

            toast.success('Signup complete');
            dispatch({ type: AuthActionTypes.LoadUser, payload: res.data });
        } catch (err: any) {
            dispatch({ type: AuthActionTypes.UserLoginFail, payload: undefined });
            toast.error(err?.response?.data.message || 'Error loggin in user');
        }
    };
    return (
        <div className="w-screen h-[80vh] flex items-center justify-center">
            <form onSubmit={handleSubmit} className="min-w-[300px] flex flex-col items-center justify-center">
                <h2 className="text-white text-3xl font-jk tracking-wide">signup</h2>

                <div className="inputGroups mt-4 w-full">
                    <Input
                        value={userData.name}
                        type="text"
                        placeholder="Username"
                        name="name"
                        onChange={handleInputChange}
                    />
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
                </div>
                <div className="buttonGroup mt-8 w-full flex flex-col items-center justify-center">
                    <Button onClick={() => {}} dClass={'text-white bg-secondary transition-all hover:bg-primary'}>
                        signup
                    </Button>
                    <h1 className="text-white mt-2 ">OR</h1>
                    <Button onClick={() => {}} dClass="text-white bg-red hover:bg-crimson ">
                        <img src={google.src} alt="googleicon" className="w-8 mr-2" /> Signup with google
                    </Button>
                    <Button onClick={() => {}} dClass="text-black bg-white hover:bg-gray-500 hover:text-white">
                        <img src={facebook.src} alt="facebookicon" className="w-8 mr-2" /> Signup with facebook
                    </Button>
                </div>
                <p className="text-gray-200 font-light text-sm mt-4">
                    <Link href="/auth/login">Already have an account? login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;
