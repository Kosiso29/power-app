/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { PlusIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon, CalendarDaysIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Table from "../../components/table";
import Search from "../../components/search";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { schedulesActions } from "@/app/store/schedules";
import Loading from "../../components/loading";
import type { Schedule as ScheduleItem } from "@/app/components/form";

export default function Schedule() {
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [requestStatus, setRequestStatus] = useState("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [requestKey, setRequestKey] = useState(0);
    const dispatch = useDispatch();

    const getData = async () => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        const response = await fetch("/api/schedules", { cache: "no-store", signal: controller.signal });
        window.clearTimeout(timeout);
        const body = await response.json().catch(() => ({}));

        if (!response.ok) throw new Error(body.message || body.error || "Schedules could not be loaded.");
        const items = Array.isArray(body) ? body : body.schedules || body.items;
        if (!Array.isArray(items)) {
            throw new Error("The schedules service returned an unexpected response.");
        }
        setSchedules(items.map(item => ({
            ...item,
            relay_numbers: Array.isArray(item.relay_numbers)
                ? item.relay_numbers.map(Number).filter(Number.isFinite)
                : [],
            days: Array.isArray(item.days) ? item.days : [],
        })));
    }
    useEffect(() => {
        dispatch(schedulesActions.updateSchedules(schedules));
    }, [schedules, dispatch])

    useEffect(() => {
        setRequestStatus("loading");
        setErrorMessage("");
        getData()
            .then(() => setRequestStatus("success"))
            .catch((error) => {
                setRequestStatus("error");
                setErrorMessage(
                    error instanceof DOMException && error.name === "AbortError"
                        ? "The schedules service took too long to respond."
                        : error?.message || "Schedules could not be loaded."
                );
            });
    }, [requestKey]);

    return (
        <div className="mx-auto max-w-[1440px]">
            <p className="text-xs font-black uppercase text-brand-cyan">Automation</p>
            <h1 className='mt-2 text-3xl font-black text-brand-navy sm:text-4xl'>Schedules</h1>
            <p className="mt-2 text-sm text-slate-500">Create and manage automatic relay routines.</p>
            <div className="mt-10 flex items-center justify-between gap-2">
                <Search placeholder="Search schedules..." />
                <Link
                    href="/dashboard/schedule/create"
                    className="brand-action"
                >
                    <span className="hidden md:block">Create Schedule</span>{' '}
                    <PlusIcon className="h-5 md:ml-4" />
                </Link>
            </div>
            <div className='brand-panel mt-6 h-auto w-full px-2 py-8 md:p-8'>
                {requestStatus === "loading" && (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-center text-slate-400">
                        <Loading />
                        <p className="text-sm">Loading schedules...</p>
                    </div>
                )}
                {requestStatus === "error" && (
                    <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
                        <ExclamationTriangleIcon className="h-9 w-9 text-rose-400" />
                        <h2 className="mt-4 font-bold text-brand-navy">Unable to load schedules</h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{errorMessage}</p>
                        <button type="button" className="brand-action mt-5 w-auto" onClick={() => setRequestKey(key => key + 1)}>
                            <ArrowPathIcon className="h-4 w-4" />
                            Try again
                        </button>
                    </div>
                )}
                {requestStatus === "success" && schedules.length === 0 && (
                    <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
                        <CalendarDaysIcon className="h-9 w-9 text-brand-cyan" />
                        <h2 className="mt-4 font-bold text-brand-navy">No schedules found</h2>
                        <p className="mt-2 text-sm text-slate-400">Create a schedule to automate your connected relays.</p>
                    </div>
                )}
                {requestStatus === "success" && schedules.length > 0 && <Table schedules={schedules} />}
            </div>
        </div>
    );
}
