'use client'

import Image from "next/image";
import Button from "./ui/button";
import TextInput from "./ui/text-input";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <main className="flex h-screen">
            <div className="bg-white basis-[65%] h-full bg-signin-hero bg-no-repeat bg-center"></div>
            <div className="bg-primary basis-[35%] h-full flex justify-center items-center">
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
                    <Link href="/dashboard">
                        <Button>Login</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
