'use client'

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

export default function Form() {
    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Create Schedule
            </h1>
            <div className='bg-white w-full mt-8 rounded-lg md:p-8 py-8 px-2 h-auto'>
                <form aria-describedby="form-error">
                    <div className="rounded-md bg-gray-100 p-4 md:p-6">
                        {/* Customer Name */}
                        <div className="mb-4">
                            <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                                Schedule type
                            </label>
                            <div className="relative">
                                <select
                                    id="customer"
                                    name="customerId"
                                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    defaultValue=""
                                    aria-describedby="customer-error"
                                >
                                    <option value="" disabled>
                                        Select a type
                                    </option>
                                    <option>
                                        Automatic
                                    </option>
                                    <option>
                                        Manual
                                    </option>
                                </select>
                                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        {/* Customer Name */}
                        <div className="mb-4">
                            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                                Schedule name
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="text"
                                        placeholder="Name of Schedule"
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        aria-describedby="amount-error"
                                    />
                                    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {/* Invoice Amount */}
                        <div className="mb-4">
                            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                                Choose start time
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="date"
                                        placeholder="Enter USD amount"
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        aria-describedby="amount-error"
                                    />
                                    <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        </div>

                        {/* Invoice Amount */}
                        <div className="mb-4">
                            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                                Choose end time
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="date"
                                        placeholder="Enter USD amount"
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        aria-describedby="amount-error"
                                    />
                                    <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        </div>

                        {/* Invoice Status */}
                        <fieldset className='mb-4'>
                            <legend className="mb-2 block text-sm font-medium">
                                Set schedule status
                            </legend>
                            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                                <div className="flex gap-4">
                                    <div className="flex items-center">
                                        <input
                                            id="pending"
                                            name="status"
                                            type="radio"
                                            value="pending"
                                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                            aria-describedby="status-error"
                                        />
                                        <label
                                            htmlFor="pending"
                                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-400 px-3 py-1.5 text-xs font-medium text-white"
                                        >
                                            inactive <XMarkIcon className="h-4 w-4" />
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="paid"
                                            name="status"
                                            type="radio"
                                            value="paid"
                                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                            aria-describedby="status-error"
                                        />
                                        <label
                                            htmlFor="paid"
                                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white"
                                        >
                                            active <CheckIcon className="h-4 w-4" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Invoice Status */}
                        {/* <fieldset>
                            <legend className="mb-2 block text-sm font-medium">
                                Set frequency
                            </legend>
                            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                                <div className="flex gap-4">
                                    <div className="flex items-center">
                                        <input
                                            id="pending"
                                            name="status"
                                            type="radio"
                                            value="pending"
                                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                            aria-describedby="status-error"
                                        />
                                        <label
                                            htmlFor="pending"
                                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                                        >
                                            one time <ArrowUturnDownIcon className="h-4 w-4" />
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="paid"
                                            name="status"
                                            type="radio"
                                            value="paid"
                                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                            aria-describedby="status-error"
                                        />
                                        <label
                                            htmlFor="paid"
                                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-400 px-3 py-1.5 text-xs font-medium text-white"
                                        >
                                            recurring <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset> */}
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <Link
                            href="/dashboard/schedule"
                            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </Link>
                        <Link
                            href="/dashboard/schedule/create"
                            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            <span className="hidden md:block">Create Schedule</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
