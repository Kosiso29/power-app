import React from 'react';
import NavLink from "./nav-link";
import Image from "next/image";
import { HomeModernIcon, ClockIcon, TableCellsIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Logout from "./logout";

const sideBarData = [
    { name: "OVERVIEW", href: "/dashboard", icon: HomeModernIcon },
    { name: "SCHEDULE", href: "/dashboard/schedule", icon: ClockIcon },
    { name: "REPORT", href: "/dashboard/report", icon: TableCellsIcon },
    { name: "SETTING", href: "/dashboard/setting", icon: Cog6ToothIcon },
]

export default function Sidebar() {
    return (
        <aside className='fixed bottom-0 left-0 right-0 z-20 flex h-20 items-center justify-between border-t border-cyan-300/40 bg-[linear-gradient(90deg,#071a55_0%,#0a0f1f_52%,#071a55_100%)] px-3 shadow-[0_-10px_30px_rgba(10,15,31,0.16)] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-brand-cyan before:to-transparent sm:bottom-auto sm:right-auto sm:h-screen sm:max-h-screen sm:w-[length:var(--sidebar-width)] sm:flex-col sm:border-r sm:border-t-0 sm:bg-[linear-gradient(180deg,#071a55_0%,#0a0f1f_42%,#0a0f1f_100%)] sm:px-0 sm:py-8 sm:before:bottom-0 sm:before:left-auto sm:before:right-0 sm:before:top-0 sm:before:h-auto sm:before:w-px sm:before:bg-gradient-to-b'>
            <div className="hidden flex-col items-center sm:flex">
                <Image src="/cyberwatt-logo.png" width={52} height={52} alt="Cyberwatt" />
                <span className="brand-wordmark brand-wordmark-sidebar mt-3 text-white"><span>Cyber</span><span>watt</span></span>
            </div>
            <nav className='flex flex-1 items-center justify-evenly sm:flex-initial sm:flex-col sm:gap-5' aria-label="Dashboard navigation">
                {
                    sideBarData.map(data => {
                        const Icon = data.icon;
                        return (
                            <NavLink key={data.name} href={data.href}>
                                <Icon width={20} height={20} />
                                {data.name}
                            </NavLink>
                        )
                    })
                }
            </nav>
            <div className="flex items-center justify-center">
                <Logout />
            </div>
        </aside>
    )
}
