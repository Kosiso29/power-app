'use client'

import Form from "@/app/components/form";

export default function Page() {
    return (
        <div className="mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase text-brand-cyan">Automation</p>
            <h1 className='mt-2 text-3xl font-black text-brand-navy sm:text-4xl'>Create schedule</h1>
            <p className="mt-2 text-sm text-slate-500">Set when connected relays should turn on or off.</p>
            <div className='brand-panel mt-8 h-auto w-full px-3 py-8 md:p-8'>
                <Form />
            </div>
        </div>
    );
}
