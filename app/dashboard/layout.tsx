import React from 'react';
import Sidebar from "../components/sidebar";
import { redirect } from "next/navigation";
import { hasActiveSession } from "../utils/serverAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
    if (!hasActiveSession()) {
        redirect("/login");
    }

    return (
        <div className='dashboard-shell min-h-screen max-w-full'>
            <Sidebar />
            <main className="min-h-screen max-w-full px-4 pb-28 pt-6 sm:ml-[length:var(--sidebar-width)] sm:w-[calc(100%-var(--sidebar-width))] sm:p-8 lg:p-9">
                {children}
            </main>
        </div>
    )
}
