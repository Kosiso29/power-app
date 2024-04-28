'use client'

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NavLink({ href, onClick, children }: { href: string, onClick?: React.MouseEventHandler<HTMLAnchorElement>, children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <Link
            href={href}
            onClick={onClick}
            className={clsx(
                "text-white rounded-md hover:bg-primary-hover flex flex-col justify-between items-center h-16 w-20 gap-1 p-3 text-[.7rem]",
                {
                    "bg-primary-active": pathname === href || pathname === href + "/create"
                }
            )}
        >
            {children}
        </Link>
    )
}
