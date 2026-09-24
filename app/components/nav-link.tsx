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
                "flex h-14 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-transparent p-2 text-[.65rem] font-bold text-slate-300 transition-all hover:border-blue-400/40 hover:bg-blue-500/20 hover:text-white sm:h-16 sm:w-20 sm:text-[.7rem]",
                {
                    "border-primary bg-primary text-white shadow-none": pathname === href || pathname === href + "/create"
                }
            )}
        >
            {children}
        </Link>
    )
}
