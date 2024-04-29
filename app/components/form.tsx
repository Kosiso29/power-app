//@ts-nocheck

import { useState } from "react";
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
import { getCookieByNameEndsWith } from "@/app/utils/getCookies";
import { useSelector } from "react-redux";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const switches = ['SW1', 'SW2', 'SW3', 'SW4']

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Form({ schedule }: { schedule?: any }) {
    const [loading, setLoading] = useState(false);
    const deviceId = useSelector(state => state.authReducer.deviceId);

    const postData = async (apiData: any, idToken) => {
        console.log('idToken', idToken);
        await new Promise((resolve, reject) => {
            axios.post('https://5jl4i1e6j7.execute-api.eu-west-3.amazonaws.com/dev', { ...apiData }, {
                headers: {
                    'Authorization': `${idToken}`
                }
            })
                .then(response => {
                    setLoading(false);
                    toast.success('Schedule created');
                    resolve(response);
                })
                .then(() => window.location.href = "/dashboard/schedule")
                .catch((error) => {
                    setLoading(false);
                    toast.error(`There was an error: ${error?.response?.data || error?.response || error}`)
                });
        })
    }

    const patchData = async (apiData: any, idToken) => {
        await new Promise((resolve, reject) => {
            axios.put(`https://5jl4i1e6j7.execute-api.eu-west-3.amazonaws.com/dev/${deviceId}?sort_key=${schedule.id}`, { ...apiData }, {
                headers: {
                    'Authorization': `${idToken}`
                }
            })
                .then(response => {
                    setLoading(false);
                    toast.success('Schedule updated');
                    resolve(response);
                })
                .then(() => window.location.href = "/dashboard/schedule")
                .catch((error) => {
                    setLoading(false);
                    toast.error(`There was an error: ${error?.response?.data || error?.response || error}`)
                });
        })
    }

    const getFormData = async (formData: any) => {
        const formDataObject: any = {};

        formData.forEach((value: any, key: any) => {
            if (!/days|switches/.test(key)) {
                formDataObject[key] = value;
            }
        });

        const switches = formData.getAll('switches');
        const days = formData.getAll('days')
        const apiData = {
            ...formDataObject,
            switches,
            days,
            effect: formDataObject.effect || 'off',
            device_id: deviceId,
            from: Number(formDataObject.from.replace(':', '')),
            to: Number(formDataObject.to.replace(':', ''))
        }
        const idToken: any = getCookieByNameEndsWith('idToken');

        if (schedule) {
            await patchData(apiData, idToken);
        } else {
            await postData(apiData, idToken);
        }
    }

    const convertIntegerTime = (time) => {
        if (!time) return;
        let newTime = time.toString();
        if (newTime.length < 4) {
            newTime = "0" + newTime;
        }
        return newTime.slice(0, 2) + ":" + newTime.slice(2);
    }

    return (
        <form aria-describedby="form-error" action={getFormData}>
            <div className="rounded-md bg-gray-100 p-4 md:p-6">
                {/* Schedule Type */}
                <div className="mb-4">
                    <label htmlFor="scheduleType" className="mb-2 block text-sm font-medium">
                        Schedule type
                    </label>
                    <div className="relative">
                        <select
                            id="scheduleType"
                            name="schedule_type"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue={schedule?.schedule_type || ""}
                            aria-describedby="scheduleType-error"
                        >
                            <option value="" disabled>
                                Select a type
                            </option>
                            <option value="Automatic">
                                Automatic
                            </option>
                            <option value="Manual">
                                Manual
                            </option>
                        </select>
                        <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Schedule Name */}
                <div className="mb-4">
                    <label htmlFor="scheduleName" className="mb-2 block text-sm font-medium">
                        Schedule name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="scheduleName"
                                name="schedule_name"
                                type="text"
                                defaultValue={schedule?.schedule_name}
                                placeholder="Name of Schedule"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="scheduleName-error"
                            />
                            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Switches */}
                <fieldset className='mb-4'>
                    <legend className="mb-2 block text-sm font-medium">
                        Switches
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex flex-wrap gap-4">
                            {
                                switches.map((item, index) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <label
                                            htmlFor={item}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white"
                                        >
                                            {item}
                                        </label>
                                        <input
                                            id={item}
                                            name="switches"
                                            type="checkbox"
                                            defaultChecked={schedule?.switches.includes(item)}
                                            value={item}
                                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                            aria-describedby="switches-error"
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </fieldset>

                {/* Effect */}
                <fieldset className='mb-4'>
                    <legend className="mb-2 block text-sm font-medium">
                        Switches state (should switches be turned on or off?)
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3 text-[.8rem] w-fit flex gap-2 items-center">
                        <span>OFF</span>
                        <label htmlFor='effect' className="switch">
                            <input id='effect' name='effect' type="checkbox" defaultChecked={schedule?.effect === "on"} className="" />
                            <span className="slider"></span>
                        </label>
                        <span>ON</span>
                    </div>
                </fieldset>

                {/* Start date */}
                <div className="mb-4">
                    <label htmlFor="startDate" className="mb-2 block text-sm font-medium">
                        Choose start date
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="startDate"
                                name="start_date"
                                type="date"
                                defaultValue={schedule ? schedule?.start_date : new Date().toISOString().split('T')[0]}
                                placeholder="Start date"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="startDate-error"
                            />
                            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* End date */}
                <div className="mb-4">
                    <label htmlFor="endDate" className="mb-2 block text-sm font-medium">
                        Choose end date
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="endDate"
                                name="end_date"
                                type="date"
                                defaultValue={schedule ? schedule?.end_date : new Date().toISOString().split('T')[0]}
                                placeholder="End date"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="endDate-error"
                            />
                            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Start time */}
                <div className="mb-4">
                    <label htmlFor="startTime" className="mb-2 block text-sm font-medium">
                        Choose start time
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="startTime"
                                name="from"
                                type="time"
                                defaultValue={schedule ? convertIntegerTime(schedule?.from) : `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`}
                                placeholder="Start time"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="startTime-error"
                            />
                            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* End time */}
                <div className="mb-4">
                    <label htmlFor="endTime" className="mb-2 block text-sm font-medium">
                        Choose end time
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="endTime"
                                name="to"
                                type="time"
                                defaultValue={schedule ? convertIntegerTime(schedule?.to) : `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`}
                                placeholder="End time"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="endTime-error"
                            />
                            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Schedule Status */}
                <fieldset className='mb-4'>
                    <legend className="mb-2 block text-sm font-medium">
                        Set schedule status
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                                <input
                                    id="status"
                                    name="status"
                                    type="radio"
                                    defaultChecked={schedule?.status === "active"}
                                    value="active"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                    aria-describedby="status-error"
                                />
                                <label
                                    htmlFor="status"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white"
                                >
                                    active <CheckIcon className="h-4 w-4" />
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="status"
                                    name="status"
                                    type="radio"
                                    defaultChecked={schedule?.status === "inactive"}
                                    value="inactive"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                    aria-describedby="status-error"
                                />
                                <label
                                    htmlFor="status"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-400 px-3 py-1.5 text-xs font-medium text-white"
                                >
                                    inactive <XMarkIcon className="h-4 w-4" />
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Days */}
                <fieldset className='mb-4'>
                    <legend className="mb-2 block text-sm font-medium">
                        Days
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex flex-wrap gap-4">
                            {
                                days.map(item => (
                                    <div key={item} className="flex items-center gap-2">
                                        <label
                                            htmlFor={item}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white"
                                        >
                                            {item}
                                        </label>
                                        <input
                                            id={item}
                                            name="days"
                                            type="checkbox"
                                            defaultChecked={schedule?.days.includes(item)}
                                            value={item}
                                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                            aria-describedby="days-error"
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className="mt-6 flex justify-center md:justify-end gap-4">
                <Link
                    href="/dashboard/schedule"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    onClick={() => setLoading(true)}
                >
                    <span>{schedule ? "Update Schedule" : "Create Schedule"}</span>
                </button>
                {
                    loading ? <div className='self-center'><Loading small /></div> : null
                }
            </div>
        </form>
    )
}
