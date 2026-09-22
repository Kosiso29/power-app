'use client'

import Button from "../ui/button";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Login() {
    const [loading, setLoading] = useState(false);

    const signIn = () => {
        if (loading) {
            return;
        }

        setLoading(true);
        window.location.href = '/api/auth/login';
    }

    useEffect(() => {
        const error = new URLSearchParams(window.location.search).get('error');

        if (error) {
            toast.error(`Login failed: ${error}`);
        }
    }, []);

    return (
        <main className="min-h-screen sign-in-background lg:grid lg:grid-cols-[1fr_1fr]">
            <section className="sign-in-right relative flex min-h-[32vh] flex-col justify-between overflow-hidden p-6 sm:p-10 lg:min-h-screen lg:p-14" aria-label="Cyberwatt">
                <Image
                    src="/cyberwatt-signin-home-smart-switch.png"
                    alt="A connected light switch in a Cyberwatt-powered home"
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-[72%_44%] lg:object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/65 via-brand-navy/15 to-brand-navy/80 lg:bg-gradient-to-r lg:from-brand-navy/50 lg:via-brand-navy/20 lg:to-transparent" />
                <div className="relative z-10 flex items-center gap-3 text-white">
                    <Image src="/cyberwatt-logo.png" width={45} height={45} alt="" />
                    <span className="brand-wordmark brand-wordmark-header"><span>Cyber</span><span>watt</span></span>
                </div>
                <div className="relative z-10 hidden max-w-xl text-white lg:block">
                    <p className="mb-4 text-sm font-bold uppercase text-cyan-200">Smart power for any home</p>
                    <h1 className="text-4xl font-black leading-tight">Your power, under control.</h1>
                    <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">Your connected home, at a glance.</p>
                </div>
            </section>
            <section className="sign-in-form flex min-h-[58vh] items-center justify-center px-6 py-14 sm:px-10 lg:min-h-screen lg:px-16">
                <div className="w-full max-w-md">
                    <p className="text-sm font-bold uppercase text-cyan-300">Cyberwatt app</p>
                    <h2 className="mt-4 text-5xl font-black leading-tight text-white sm:text-6xl">Welcome <span className="text-primary">back</span></h2>
                    <p className="mt-4 max-w-sm text-base leading-7 text-slate-300">Sign in securely to manage your connected devices and schedules.</p>
                    <Button
                        onClick={signIn}
                        disabled={loading}
                        className="sign-in-action mt-9 min-h-14"
                    >
                        {loading ? 'Redirecting...' : 'Continue with AWS'}
                        {!loading && <ArrowRightIcon className="h-5 w-5" />}
                    </Button>
                    <p className="mt-6 text-sm leading-6 text-slate-400">Authentication is handled securely through Amazon Cognito.</p>
                </div>
            </section>
        </main>
    );
}
