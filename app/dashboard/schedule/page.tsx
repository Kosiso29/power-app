/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
'use client'

import { PlusIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon, CalendarDaysIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import PrimaryButton from "../../ui/button";
import Table from "../../components/table";
import Search from "../../components/search";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { schedulesActions } from "@/app/store/schedules";
import { useSelector } from "react-redux";
import { getAuthIdToken } from "@/app/utils/authSession";
import Loading from "../../components/loading";

export default function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [requestStatus, setRequestStatus] = useState("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [requestKey, setRequestKey] = useState(0);
    const deviceId = useSelector(state => state.authReducer.deviceId);
    const dispatch = useDispatch();

    const getData = async (idToken) => {
        const response = await axios.get(`https://5jl4i1e6j7.execute-api.eu-west-3.amazonaws.com/dev/${deviceId}?sort_key=`, {
            headers: {
                'Authorization': `${idToken}`
            },
            timeout: 15000,
        });

        if (!Array.isArray(response.data)) {
            throw new Error("The schedules service returned an unexpected response.");
        }

        setSchedules(response.data);
    }
    useEffect(() => {
        dispatch(schedulesActions.updateSchedules(schedules));
    }, [schedules, dispatch])

    useEffect(() => {
        const idToken = getAuthIdToken();

        if (!idToken) {
            setRequestStatus("error");
            setErrorMessage("Your session is unavailable. Please sign in again.");
            return;
        }

        if (!deviceId) {
            const deviceTimer = window.setTimeout(() => {
                setRequestStatus("error");
                setErrorMessage("Your device could not be identified. Refresh the page and try again.");
            }, 8000);

            return () => window.clearTimeout(deviceTimer);
        }

        setRequestStatus("loading");
        setErrorMessage("");
        getData(idToken)
            .then(() => setRequestStatus("success"))
            .catch((error) => {
                setRequestStatus("error");
                setErrorMessage(
                    error?.code === "ECONNABORTED"
                        ? "The schedules service took too long to respond."
                        : error?.message || "Schedules could not be loaded."
                );
            });
    }, [deviceId, requestKey]);

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
