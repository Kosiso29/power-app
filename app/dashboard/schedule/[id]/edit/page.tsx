/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from "react";
import Link from 'next/link';
import {
    CheckIcon,
    ClockIcon,
    UserCircleIcon,
    CalendarIcon,
    XMarkIcon,
    ArrowPathRoundedSquareIcon,
    ArrowUturnDownIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Loading from "@/app/components/loading";
import Form from "@/app/components/form";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { getAuthIdToken } from "@/app/utils/authSession";

export default function Page({ params }: { params: { id: string } }) {
    const [schedule, setSchedule] = useState(null);


    const getData = async (idToken: string) => {
        const [deviceId, scheduleId] = params.id.split("-");
        await new Promise((resolve, reject) => {
            axios.get(`https://5jl4i1e6j7.execute-api.eu-west-3.amazonaws.com/dev/schedules/${scheduleId}?device_id=${deviceId}`, {
                headers: {
                    'Authorization': `${idToken}`
                }
            })
                .then(response => response.data)
                .then(data => {
                    setSchedule(data);
                    resolve(data);
                })
                .catch(() => reject());
        })
    }

    useEffect(() => {
        const idToken = getAuthIdToken();

        if (idToken) {
            getData(idToken);
        }
    }, [params.id]);

    return (
        <div className="mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase text-brand-cyan">Automation</p>
            <h1 className='mt-2 text-3xl font-black text-brand-navy sm:text-4xl'>Edit schedule</h1>
            <p className="mt-2 text-sm text-slate-500">Update this relay routine.</p>
            <div className='brand-panel mt-8 h-auto w-full px-3 py-8 md:p-8'>
                { schedule ? <Form schedule={schedule} /> : <div><Loading /></div>}
            </div>
        </div>
    );
}
