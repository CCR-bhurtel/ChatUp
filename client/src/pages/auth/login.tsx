import Button from '@/components/reusables/Button';
import Input from '@/components/reusables/Input';
import React from 'react';
import google from '../../assets/icons/google.png';
import facebook from '../../assets/icons/facebook.png';

function login() {
    return (
        <div className="w-screen h-[80vh] flex items-center justify-center">
            <form className="min-w-[300px] flex flex-col items-center justify-center">
                <h2 className="text-white text-3xl font-jk tracking-wide">login</h2>

                <div className="inputGroups mt-4 w-full">
                    <Input type="email" placeholder="Email" name="email" onChange={(e) => {}} />
                    <Input type="password" placeholder="Password" name="password" onChange={(e) => {}} />
                </div>
                <div className="buttonGroup mt-8 w-full flex flex-col items-center justify-center">
                    <Button onClick={() => {}} dClass={'text-white bg-primary'}>
                        Submit
                    </Button>
                    <h1 className="text-white mt-2 ">OR</h1>
                    <Button onClick={() => {}} dClass="text-white bg-red">
                        <img src={google.src} alt="googleicon" className="w-8 mr-2" /> Login with google
                    </Button>
                    <Button onClick={() => {}} dClass="text-black bg-white">
                        <img src={facebook.src} alt="facebookicon" className="w-8 mr-2" /> Login with facebook
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default login;
