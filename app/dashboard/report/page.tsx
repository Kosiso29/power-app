import React from 'react'
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

export default function Report() {
    return (
        <div className="mx-auto max-w-[1440px]">
            <p className="text-xs font-black uppercase text-brand-cyan">Analytics</p>
            <h1 className="mt-2 text-3xl font-black text-brand-navy sm:text-4xl">Reports</h1>
            <div className="brand-panel mt-10 flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-brand-cyan">
                    <ChartBarSquareIcon className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-lg font-bold text-brand-navy">No reports available</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Reports will appear here when reporting data is available.</p>
            </div>
        </div>
    )
}
