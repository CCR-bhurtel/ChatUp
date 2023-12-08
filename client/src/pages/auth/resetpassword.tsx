import Button from '@/components/reusables/Button';
import Input from '@/components/reusables/Input';
import React from 'react';


function resetpassword() {
    return (
        <div className="w-screen h-[80vh] flex items-center justify-center">
            <form className="min-w-[300px] flex flex-col items-center justify-center">
                <h2 className="text-white text-3xl font-jk tracking-wide">reset password</h2>

                <div className="inputGroups mt-4 w-full">
                    <Input type="password" placeholder="password" name="password" onChange={(e) => {}} />
                    <Input type="password" placeholder="confirm password" name="confirmPassword" onChange={(e) => {}} />
                </div>
                <div className="buttonGroup mt-8 w-full flex flex-col items-center justify-center">
                    <Button onClick={() => {}} dClass={'text-white bg-primary'}>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default resetpassword;
