/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
'use client'

import axios from "axios";
import {
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";
import Appliance from "./appliance";
import Loading from "@/app/components/loading";
import YesNo from "./yesno";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

const daysMap = {
    "Monday": "M",
    "Tuesday": "T",
    "Wednesday": "W",
    "Thursday": "T",
    "Friday": "F",
    "Saturday": "S",
    "Sunday": "S"
}

export default function Table({ schedules }) {
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState("");
    const [deleteId, setDeleteId] = useState("");

    const handleDelete = (id) => {
        setDeleteId(id);
    }

    const postData = async () => {
        await new Promise((resolve) => {
            axios.delete(`https://5jl4i1e6j7.execute-api.eu-west-3.amazonaws.com/dev/12a34b56c78d9?sort_key=${deleteId}`)
                .then(response => {
                    setDeleteId("");
                    setLoading(false);
                    setAnswer("");
                    toast.success('Schedule deleted');
                    resolve(response);
                })
                .then(() => window.location.reload())
                .catch((error) => {
                    setLoading(false);
                    toast.error(`Schedule failed to delete: ${error?.response?.data || error?.response || error}`);
                });
        })
    }

    useEffect(() => {
        if (answer === "yes") {
            setLoading(true);
            postData();
        }
        if (answer === "no") {
            setAnswer("");
            setDeleteId("");
        }
    }, [answer, deleteId])

    return (
        <div className="flow-root max-w-full">
            <div className="inline-block min-w-full align-middle max-w-full">
                <div className="rounded-lg bg-gray-100 p-2 max-w-full">
                    <div className="lg:hidden">
                        {schedules?.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between border-b pb-4 gap-4">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <div className="flex items-center gap-2">
                                                <Appliance size={15} defaultShow={schedule.effect === "on"} className='p-1 cursor-default' /> <span>{schedule.schedule_name}</span>
                                            </div>
                                        </div>
                                        <div className='flex justify-between gap-2'>
                                            <span>{schedule.schedule_type}</span>
                                            <span>
                                                {
                                                    schedule.status === 'active' ?
                                                        <span
                                                            className="w-fit flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white"
                                                        >
                                                            {schedule.status}
                                                        </span> :
                                                        <span
                                                            className="w-fit flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-400 px-3 py-1.5 text-xs font-medium text-white"
                                                        >
                                                            {schedule.status}
                                                        </span>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            {schedule.switches.toString().replace(/[|]/g, "").replace(/,/g, ' ')}
                                        </div>
                                        <div>
                                            {
                                                Object.entries(daysMap).map((entry, index) => {
                                                    if (schedule.days.includes(entry[0])) {
                                                        return <span key={entry[1] + index} className='mr-1 text-primary font-bold'>{entry[1]}</span>
                                                    }
                                                    return <span key={entry[1] + index} className='mr-1 text-gray-400'>{entry[1]}</span>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">
                                            {schedule.from} / {schedule.start_date}
                                        </p>
                                        <p>{schedule.to} / {schedule.end_date}</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/schedule`}
                                            className="rounded-md border p-2 hover:bg-gray-100"
                                        >
                                            <PencilIcon className="w-5" />
                                        </Link>
                                        <Link
                                            href={`/dashboard/schedule`}
                                            className="rounded-md border p-2 hover:bg-gray-100"
                                        >
                                            <TrashIcon className="w-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 lg:table max-w-full">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 hover:resize-x overflow-hidden min-w-full">
                                    Schedule name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium hover:resize-x overflow-hidden min-w-full">
                                    Schedule type
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium hover:resize-x overflow-hidden min-w-full">
                                    Switches
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium hover:resize-x overflow-hidden min-w-full">
                                    Start time / date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium hover:resize-x overflow-hidden min-w-full">
                                    End time / date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium hover:resize-x overflow-hidden min-w-full">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium hover:resize-x overflow-hidden min-w-full">
                                    Days
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white max-w-full">
                            {schedules?.length > 0 && schedules?.map((schedule) => (
                                <tr
                                    key={schedule.id}
                                    className="w-full max-w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="xl:whitespace-nowrap py-3 pl-6 pr-3 hover:resize-x overflow-hidden min-w-full">
                                        <span className="flex items-center gap-2">
                                            <Appliance size={15} defaultShow={schedule.effect === "on"} className='p-1 cursor-default' /> <span>{schedule.schedule_name}</span>
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3 hover:resize-x overflow-hidden min-w-full">
                                        {schedule.schedule_type}
                                    </td>
                                    <td className="px-3 py-3 hover:resize-x overflow-hidden min-w-full">
                                        {schedule.switches.toString().replace(/[|]/g, "").replace(/,/g, ' ')}
                                    </td>
                                    <td className="px-3 py-3 hover:resize-x overflow-hidden min-w-full">
                                        {schedule.from} / {schedule.start_date}
                                    </td>
                                    <td className="px-3 py-3 hover:resize-x overflow-hidden min-w-full">
                                        {schedule.to} / {schedule.end_date}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3 hover:resize-x overflow-hidden min-w-full">
                                        {
                                            schedule.status === 'active' ?
                                                <span
                                                    className="w-fit flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white"
                                                >
                                                    {schedule.status}
                                                </span> :
                                                <span
                                                    className="w-fit flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-400 px-3 py-1.5 text-xs font-medium text-white"
                                                >
                                                    {schedule.status}
                                                </span>
                                        }
                                    </td>
                                    <td className="px-3 py-3 hover:resize-x overflow-hidden min-w-full">
                                        <div className='flex flex-wrap'>
                                            {
                                                Object.entries(daysMap).map((entry, index) => {
                                                    if (schedule.days.includes(entry[0])) {
                                                        return <span key={entry[1] + index} className='mr-1 text-primary font-bold'>{entry[1]}</span>
                                                    }
                                                    return <span key={entry[1] + index} className='mr-1 text-gray-400'>{entry[1]}</span>
                                                })
                                            }
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/dashboard/schedule/12a34b56c78d9-${schedule.id}/edit`}
                                                className="rounded-md border p-2 hover:bg-gray-100"
                                            >
                                                <PencilIcon className="w-5" />
                                            </Link>
                                            <button
                                                className="rounded-md border p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleDelete(schedule.id)}
                                            >
                                                {
                                                    loading && (schedule.id === deleteId) ? <div className="self-center justify-self-end"><Loading small /></div> : <TrashIcon className="w-5" />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='mt-8'>
                    {
                        schedules?.length === 0 && <Loading />
                    }
                </div>
            </div>
            <YesNo setAnswer={setAnswer} show={!!deleteId && !answer} message="Delete schedule?" />
            <ToastContainer autoClose={3500} position="top-right" />
        </div>
    )
}
