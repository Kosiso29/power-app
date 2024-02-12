import React from 'react';
import Sidebar from "../components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='max-w-full h-screen'>
            <Sidebar />
            <div className="max-w-full sm:ml-[length:var(--sidebar-width)] sm:w-[calc(100%-var(--sidebar-width))] p-10 bg-[#EEF] min-h-screen">
                {children}
            </div>
        </div>
    )
}
