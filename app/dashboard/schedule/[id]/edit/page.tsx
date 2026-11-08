'use client'

import { useEffect, useState } from "react";
import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Form, { type Schedule } from "@/app/components/form";
import Loading from "@/app/components/loading";

export default function Page({ params }: { params: { id: string } }) {
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [error, setError] = useState("");
    const [requestKey, setRequestKey] = useState(0);

    useEffect(() => {
        let active = true;
        setError("");
        setSchedule(null);

        fetch(`/api/schedules/${encodeURIComponent(params.id)}`, { cache: "no-store" })
            .then(async response => {
                const body = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(body.message || body.error || "Unable to load this schedule.");
                const item = body.schedule || body.item || body.items?.[0] || body;
                return {
                    ...item,
                    relay_numbers: Array.isArray(item.relay_numbers)
                        ? item.relay_numbers.map(Number).filter(Number.isFinite)
                        : [],
                    days: Array.isArray(item.days) ? item.days : [],
                };
            })
            .then(item => active && setSchedule(item))
            .catch(reason => active && setError(reason instanceof Error ? reason.message : "Unable to load this schedule."));

        return () => { active = false; };
    }, [params.id, requestKey]);

    return (
        <div className="mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase text-brand-cyan">Automation</p>
            <h1 className="mt-2 text-3xl font-black text-brand-navy sm:text-4xl">Edit schedule</h1>
            <p className="mt-2 text-sm text-slate-500">Update this relay routine.</p>
            <div className="brand-panel mt-8 h-auto w-full px-3 py-8 md:p-8">
                {schedule && <Form schedule={schedule} />}
                {!schedule && !error && <div className="flex min-h-56 items-center justify-center"><Loading /></div>}
                {error && <div className="flex min-h-56 flex-col items-center justify-center text-center"><ExclamationTriangleIcon className="h-9 w-9 text-rose-400" /><h2 className="mt-4 font-bold text-brand-navy">Unable to load schedule</h2><p className="mt-2 text-sm text-slate-400">{error}</p><button type="button" className="brand-action mt-5" onClick={() => setRequestKey(key => key + 1)}><ArrowPathIcon className="h-4 w-4" />Try again</button></div>}
            </div>
        </div>
    );
}
