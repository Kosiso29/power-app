'use client'

import NavLink from "./nav-link";
import { useRouter } from 'next/navigation';
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await Auth.signOut();
            router.push('/');
            toast.success('Logout successful');
        } catch (error: any) {
            toast.error(`Error logging out: ${error.message}`);
        }
    };

    return (
        <NavLink href="#" onClick={handleLogout}>
            <ArrowLeftEndOnRectangleIcon color='rgba(210, 210, 210, .4)' width={50} height={50} />
        </NavLink>
    )
}
