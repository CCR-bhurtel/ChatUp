import Button from '@/components/reusables/Button';
import Input from '@/components/reusables/Input';
import { BASE_API_PATH } from '@/config/keys';
import axios, { AxiosError } from 'axios';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

function Forgotpassword() {
    const [email, setEmail] = useState<string>('');
    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const formSubmitHandler = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_API_PATH}/auth/forgotpassword`, { email });
            toast.success('Email sent successfully, check your inbox');
        } catch (err: any) {
            toast.error(err?.response?.data.message || 'Error sending email');
        }
    };
    return (
        <div className="w-screen h-[80vh] flex items-center justify-center">
            <form onSubmit={formSubmitHandler} className="min-w-[300px] flex flex-col items-center justify-center">
                <h2 className="text-white text-3xl font-jk tracking-wide">forgot password</h2>

                <div className="inputGroups mt-4 w-full">
                    <Input type="email" placeholder="email" name="password" onChange={inputChangeHandler} />
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

export default Forgotpassword;
