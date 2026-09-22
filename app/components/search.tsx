'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search({ placeholder }: { placeholder: string }) {

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-lg border border-slate-200 bg-white py-[9px] pl-10 text-sm text-brand-navy outline-none placeholder:text-slate-400 focus:border-brand-cyan focus:ring-2 focus:ring-cyan-100"
                placeholder={placeholder}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 peer-focus:text-brand-cyan" />
        </div>
    );
}
