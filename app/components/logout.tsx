/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import NavLink from "./nav-link";
import { useRouter } from 'next/navigation';
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-toastify';
import { useEffect } from "react";
import { clearAuthSession, getAuthIdToken } from "../utils/authSession";

export default function Logout() {
    const router = useRouter();
    async function checkUser() {
        const idToken = getAuthIdToken();

        if (!idToken) {
            toast.error('Authentication failed! Token not found');
            router.replace('/login');
        }
    }

    const handleLogout = async () => {
        clearAuthSession();
        window.location.href = '/api/auth/logout';
    };

    useEffect(() => {
        checkUser()
    }, [])

    return (
        <NavLink href="#" onClick={handleLogout}>
            <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
        </NavLink>
    )
}
