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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Amplify.configure({ Auth: AwsConfigAuth });

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

    const router = useRouter();
    console.log('process', process.env.NODE_ENV);

    const signIn = async () => {
        try {
            const user = await Auth.signIn(email, password);
            console.log('user', user);
            if (user?.username) {
                toast.success('Login successful!');
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
            <ToastContainer autoClose={3500} position="top-right" />
        </main>
    );
}
