/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import NavLink from "./nav-link";
import { useRouter } from 'next/navigation';
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { useEffect } from "react";

export default function Logout() {
    const router = useRouter();
    async function checkUser() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            if (!user?.signInUserSession?.idToken?.jwtToken) {
                toast.error('Authentication failed! Token not found');
                router.push('/');
            }
        } catch (error: any) {
            toast.error(`Error fetching authenticated user: ${error.message}`);
            router.push('/');
        }
    }

    const handleLogout = async () => {
        try {
            await Auth.signOut();
            router.push('/');
            toast.success('Logout successful');
        } catch (error: any) {
            toast.error(`Error logging out: ${error.message}`);
        }
    };

    useEffect(() => {
        checkUser()
    }, [])

    return (
        <NavLink href="#" onClick={handleLogout}>
            <ArrowLeftEndOnRectangleIcon color='rgba(210, 210, 210, .4)' width={50} height={50} />
        </NavLink>
    )
}
