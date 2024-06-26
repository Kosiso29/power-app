import React from 'react';
import NavLink from "./nav-link";
import Image from "next/image";
import { HomeModernIcon, ClockIcon, TableCellsIcon, Cog6ToothIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import Logout from "./logout";

const sideBarData = [
    { name: "OVERVIEW", href: "/dashboard", icon: HomeModernIcon },
    { name: "SCHEDULE", href: "/dashboard/schedule", icon: ClockIcon },
    { name: "REPORT", href: "/dashboard/report", icon: TableCellsIcon },
    { name: "SETTING", href: "/dashboard/setting", icon: Cog6ToothIcon },
]

export default function Sidebar() {
    return (
        <div className='hidden sm:flex w-[length:var(--sidebar-width)] fixed z-10 h-screen max-h-screen bg-primary flex-col justify-between py-12'>
            <Image
                src="/single-bulb.jpeg"
                width={70}
                height={70}
                className="ml-auto mr-auto rounded-[50%] mb-10"
                alt="logo"
            />
            <div className='flex flex-col gap-8 items-center'>
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
            </div>
            <div className="flex justify-center items-center">
                <Logout />
            </div>
        </div>
    )
}
