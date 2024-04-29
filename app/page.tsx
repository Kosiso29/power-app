/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import Image from "next/image";
import Button from "./ui/button";
import TextInput from "./ui/text-input";
import { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import { AwsConfigAuth } from "./config/auth";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { authActions } from "@/app/store/auth";

Amplify.configure({ Auth: AwsConfigAuth });

export default function Home() {
    const [email, setEmail] = useState(process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_AUTH_USER_NAME : "");
    const [password, setPassword] = useState(process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_AUTH_PASSWORD : "");
    const [login, setLogin] = useState(false);
    const dispatch = useDispatch();

    const router = useRouter();

    const signIn = async () => {
        try {
            const user = await Auth.signIn(email, password);
            console.log('user', user);
            if (user?.username) {
                toast.success('Login successful!');
                dispatch(authActions.updateToken(user.signInUserSession.idToken.jwtToken));
                dispatch(authActions.updateDeviceId(user.username));
                router.push('/dashboard');
            } else {
                toast.error('Login failed! User not found');
            }
        } catch (error) {
            toast.error(`Login failed: ${error?.message || error}`);
        }
    }

    useEffect(() => {
        if (login) {
            signIn();
        }
    }, [login])

    return (
        <main className="flex h-screen">
            <div className="hidden md:block bg-white basis-[65%] h-full bg-signin-hero bg-no-repeat bg-center"></div>
            <div className="bg-primary md:basis-[35%] h-full w-full flex justify-center items-center">
                <div className="flex flex-col gap-10 w-3/4">
                    <Image
                        src="/single-bulb.jpeg"
                        width={100}
                        height={100}
                        className="m-auto rounded-[50%]"
                        alt="logo"
                    />
                    <TextInput type="email" value={email} placeholder="Email" onChange={setEmail} />
                    <TextInput type="password" value={password} placeholder="Password" onChange={setPassword} />
                    <Button onClick={() => setLogin(true)}>Login</Button>
                </div>
            </div>
        </main>
    );
}
