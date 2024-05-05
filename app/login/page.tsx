/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import Image from "next/image";
import Button from "../ui/button";
import TextInput from "../ui/text-input";
import { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import { AwsConfigAuth } from "../config/auth";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { authActions } from "@/app/store/auth";

Amplify.configure({ Auth: AwsConfigAuth });

export default function Login() {
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
        <main className="flex justify-center items-center h-screen sign-in-background">
            <div className="flex flex-col lg:flex-row-reverse w-full h-full lg:h-3/4 lg:w-[90%] xl:w-3/4 shadow-2xl">
                <div className="flex justify-center items-center basis-[49%] h-full bg-[#202474] bg-no-repeat bg-cover bg-center sign-in-right">
                    <div className="text-white p-5">
                        <h1 className="text-4xl sm:text-6xl font-bold mb-10">Powersync</h1>
                        <p className="text-md sm:text-lg">Power well managed is power well used. <br />Allow us to manage your power!</p>
                    </div>
                </div>
                <div className="bg-[white] md:basis-[51%] h-full w-full flex justify-center items-center">
                    <div className="flex flex-col gap-10 w-3/4">
                        {/* <Image
                            src="/sign-in-background.jpeg"
                            width={100}
                            height={100}
                            className="m-auto rounded-[50%]"
                            alt="logo"
                        /> */}
                        <h1 className="text-2xl font-bold">Sign in</h1>
                        <TextInput type="email" value={email} placeholder="Email" onChange={setEmail} />
                        <TextInput type="password" value={password} placeholder="Password" onChange={setPassword} />
                        <div>
                            <input id="RememberMe" className="cursor-pointer" type="checkbox" />
                            <label htmlFor="RememberMe" className="ml-3 cursor-pointer">Remember me</label>
                        </div>
                        <Button onClick={() => setLogin(true)} className="bg-primary">Login</Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
