import React from 'react';
import Sidebar from "../components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Sidebar />
            <div className="ml-[length:var(--sidebar-width)] p-10 bg-[#EEF]">
                {children}
            </div>
        </div>
    )
}
