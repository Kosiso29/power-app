/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
'use client'

import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import PrimaryButton from "../../ui/button";
import Table from "../../components/table";
import Search from "../../components/search";
import { useEffect, useState } from "react";
import { getCookieByNameEndsWith } from "@/app/utils/getCookies";
import axios from "axios";
import { useDispatch } from "react-redux";
import { schedulesActions } from "@/app/store/schedules";
import { useSelector } from "react-redux";

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
        const idToken = getCookieByNameEndsWith('idToken');
        getData(idToken);
    }, []);

    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Schedule
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-16">
                <Search placeholder="Search schedules..." />
                <Link
                    href="/dashboard/schedule/create"
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <span className="hidden md:block">Create Schedule</span>{' '}
                    <PlusIcon className="h-5 md:ml-4" />
                </Link>
            </div>
            <div className='bg-white w-full mt-8 rounded-lg md:p-8 py-8 px-2 h-auto'>
                <Table schedules={schedules} />
            </div>
        </div>
    );
}