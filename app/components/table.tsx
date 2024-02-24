// @ts-nocheck

import {
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";
import Appliance from "./appliance";
import Loading from "../ui/loading";

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
    return (
        <div className="flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-100 p-2 pt-0">
                    {/* <div className="md:hidden">
                    {schedules?.map((schedule) => (
                        <div
                            key={schedule.id}
                            className="mb-2 w-full rounded-md bg-white p-4"
                        >
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <div className="mb-2 flex items-center">
                                        <Image
                                            src={schedule.image_url}
                                            className="mr-2 rounded-full"
                                            width={28}
                                            height={28}
                                            alt={`${schedule.name}'s profile picture`}
                                        />
                                        <p>{schedule.name}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{schedule.email}</p>
                                </div>
                                <InvoiceStatus status={schedule.status} />
                            </div>
                            <div className="flex w-full items-center justify-between pt-4">
                                <div>
                                    <p className="text-xl font-medium">
                                        {formatCurrency(schedule.amount)}
                                    </p>
                                    <p>{formatDateToLocal(schedule.date)}</p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <UpdateInvoice id={schedule.id} />
                                    <DeleteInvoice id={schedule.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
                    <table className="min-w-full text-gray-900 table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Schedule name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Schedule type
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Switches
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Start time / date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    End time / date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Days
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {schedules.length > 0 && schedules?.map((schedule) => (
                                <tr
                                    key={schedule.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-2">
                                            <Appliance size={15} defaultShow={schedule.effect === "on"} className='p-1 cursor-default' /> <span>{schedule.schedule_name}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {schedule.schedule_type}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {schedule.switches.toString().replace(/[|]/g, "")}
                                    </td>
                                    <td className="px-3 py-3">
                                        {schedule.from} / {schedule.start_date}
                                    </td>
                                    <td className="px-3 py-3">
                                        {schedule.to} / {schedule.end_date}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
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
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {
                                            Object.entries(daysMap).map((entry, index) => {
                                                if (schedule.days.includes(entry[0])) {
                                                    return <span key={entry[1] + index} className='mr-1 text-primary'>{entry[1]}</span>
                                                }
                                                return <span key={entry[1] + index} className='mr-1 text-gray-400'>{entry[1]}</span>
                                            })
                                        }
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='mt-8'>
                    {
                        schedules.length === 0 && <Loading />
                    }
                </div>
            </div>
        </div>
    )
}
