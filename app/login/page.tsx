'use client'

import Button from "../ui/button";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

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
        <main className="flex justify-center items-center h-screen sign-in-background">
            <div className="flex flex-col lg:flex-row-reverse w-full h-full lg:h-3/4 lg:w-[90%] xl:w-3/4 shadow-2xl">
                <div className="flex justify-center items-center basis-[49%] h-full bg-[#202474] bg-no-repeat bg-cover bg-center sign-in-right">
                    <div className="text-white p-5">
                        <h1 className="text-4xl sm:text-6xl font-bold mb-10">Cyberwatt</h1>
                        <p className="text-md sm:text-lg">Power well managed is power well used. <br />Allow us to manage your power!</p>
                    </div>
                </div>
                <div className="bg-[white] md:basis-[51%] h-full w-full flex justify-center items-center">
                    <div className="flex flex-col gap-10 w-3/4">
                        <h1 className="text-2xl font-bold">Sign in</h1>
                        <Button
                            onClick={signIn}
                            disabled={loading}
                            className="bg-primary disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'Redirecting...' : 'Continue with AWS'}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
