import React from 'react';
import NavLink from "./nav-link";
import Image from "next/image";
import { HomeModernIcon, ClockIcon, TableCellsIcon, Cog6ToothIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

const sideBarData = [
    { name: "OVERVIEW", href: "/dashboard", icon: HomeModernIcon },
    { name: "SCHEDULE", href: "/dashboard/schedule", icon: ClockIcon },
    { name: "REPORT", href: "/dashboard/report", icon: TableCellsIcon },
    { name: "SETTING", href: "/dashboard/setting", icon: Cog6ToothIcon },
]

export default function Sidebar() {
    return (
        <div className='w-[length:var(--sidebar-width)] fixed h-screen max-h-screen bg-primary flex flex-col justify-between py-12'>
            <Image
                src="/single-bulb.jpeg"
                width={80}
                height={80}
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
                <NavLink href="/">
                    <ArrowLeftEndOnRectangleIcon color='rgba(210, 210, 210, .4)' width={50} height={50} />
                </NavLink>
            </div>
        </div>
    )
}
