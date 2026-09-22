/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
'use client'

import { PlusIcon } from "@heroicons/react/24/solid";
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

export default function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const deviceId = useSelector(state => state.authReducer.deviceId);
    const dispatch = useDispatch();

    const getData = async (idToken) => {
        await new Promise((resolve, reject) => {
            axios.get(`https://5jl4i1e6j7.execute-api.eu-west-3.amazonaws.com/dev/${deviceId}?sort_key=`, {
                headers: {
                    'Authorization': `${idToken}`
                }
            })
                .then(response => response.data)
                .then(data => {
                    setSchedules(data);
                    resolve();
                })
                .catch(() => reject());
        })
    }
    useEffect(() => {
        dispatch(schedulesActions.updateSchedules(schedules));
    }, [schedules, dispatch])

    useEffect(() => {
        const idToken = getAuthIdToken();

        if (idToken && deviceId) {
            getData(idToken);
        }
    }, [deviceId]);

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
                <Table schedules={schedules} />
            </div>
        </div>
    );
}
