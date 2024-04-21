/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import Image from "next/image";
import Button from "./ui/button";
import TextInput from "./ui/text-input";
import { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import { AwsConfigAuth } from "./config/auth";
import Link from "next/link";

Amplify.configure({ Auth: AwsConfigAuth });

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

    const signIn = async () => {
        const user = await Auth.signIn("nonsoilonze@gmail.com", "Cognito5050?");
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
                    <TextInput type="string" value={password} placeholder="Password" onChange={setPassword} />
                    {/* <Link href="/dashboard">
                    </Link> */}
                    <Button onClick={() => setLogin(true)}>Login</Button>
                </div>
            </div>
        </main>
    );
}
