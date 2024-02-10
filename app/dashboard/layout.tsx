import React from 'react';
import Sidebar from "../components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='max-w-full max-h-screen'>
            <Sidebar />
            <div className="max-w-full ml-[length:var(--sidebar-width)] p-10 bg-[#EEF]">
                {children}
            </div>
        </div>
    )
}
