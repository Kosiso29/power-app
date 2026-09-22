import React from 'react';
import Sidebar from "../components/sidebar";
import { redirect } from "next/navigation";
import { hasActiveSession } from "../utils/serverAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
    if (!hasActiveSession()) {
        redirect("/login");
    }

    return (
        <div className='min-h-screen max-w-full bg-brand-surface'>
            <Sidebar />
            <main className="min-h-screen max-w-full px-4 pb-28 pt-8 sm:ml-[length:var(--sidebar-width)] sm:w-[calc(100%-var(--sidebar-width))] sm:p-10 lg:p-12">
                {children}
            </main>
        </div>
    )
}
