import React from 'react';
import Sidebar from "../components/sidebar";
import { redirect } from "next/navigation";
import { hasActiveSession } from "../utils/serverAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
    if (!hasActiveSession()) {
        redirect("/login");
    }

    return (
        <div className='max-w-full h-screen'>
            <Sidebar />
            <div className="max-w-full sm:ml-[length:var(--sidebar-width)] sm:w-[calc(100%-var(--sidebar-width))] px-5 py-10 sm:p-10 bg-[#EEF] min-h-screen">
                {children}
            </div>
        </div>
    )
}
