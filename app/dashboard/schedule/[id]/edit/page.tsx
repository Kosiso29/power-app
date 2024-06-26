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
import { getCookieByNameEndsWith } from "@/app/utils/getCookies";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

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
        const idToken: any = getCookieByNameEndsWith('idToken');
        getData(idToken);
    }, [params.id]);

    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Edit Schedule
            </h1>
            <div className='bg-white w-full mt-8 rounded-lg md:p-8 py-8 px-2 h-auto'>
                { schedule ? <Form schedule={schedule} /> : <div><Loading /></div>}
            </div>
        </div>
    );
}
