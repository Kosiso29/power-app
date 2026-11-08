'use client'

import { useState } from "react";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Loading from "./loading";
import YesNo from "./yesno";
import type { Schedule } from "./form";

const DAY_LABELS: Record<string, string> = {
    MON: "M", TUE: "T", WED: "W", THU: "T", FRI: "F", SAT: "S", SUN: "S",
};

export default function Table({ schedules }: { schedules: Schedule[] }) {
    const [deleteId, setDeleteId] = useState("");
    const [deleting, setDeleting] = useState(false);

    async function confirmDelete(answer: string) {
        if (answer !== "yes") {
            setDeleteId("");
            return;
        }

        setDeleting(true);
        try {
            const response = await fetch(`/api/schedules/${encodeURIComponent(deleteId)}`, { method: "DELETE" });
            const body = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(body.message || body.error || "Schedule failed to delete.");
            toast.success(body.message || "Schedule deleted successfully.");
            window.location.reload();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Schedule failed to delete.");
            setDeleting(false);
            setDeleteId("");
        }
    }

    return (
        <div className="flow-root max-w-full">
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                <div className="space-y-2 lg:hidden">
                    {schedules.map(schedule => (
                        <article key={schedule.schedule_id} className="rounded-lg border border-slate-200 bg-white p-4 text-slate-900">
                            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                                <div><h2 className="font-bold">{schedule.schedule_name}</h2><p className="mt-1 text-xs text-slate-500">{schedule.device_id}</p></div>
                                <Status value={schedule.status} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
                                <Detail label="Relays" value={schedule.relay_numbers.map(number => `R${number}`).join(", ")} />
                                <Detail label="Target" value={schedule.target_state} />
                                <Detail label="Starts" value={`${schedule.start_time} / ${schedule.start_date}`} />
                                <Detail label="Ends" value={`${schedule.end_time} / ${schedule.end_date}`} />
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                                <Days days={schedule.days} scheduleType={schedule.schedule_type} startDate={schedule.start_date} />
                                <Actions scheduleId={schedule.schedule_id} deleting={deleting && deleteId === schedule.schedule_id} onDelete={setDeleteId} />
                            </div>
                        </article>
                    ))}
                </div>

                <table className="hidden min-w-full text-left text-sm text-slate-900 lg:table">
                    <thead><tr>{["Schedule", "Device", "Relays", "Target", "Start", "End", "Status", "Days", ""].map((label, index) => <th key={`${label}-${index}`} className="whitespace-nowrap px-3 py-4 font-medium">{label}</th>)}</tr></thead>
                    <tbody className="bg-white">
                        {schedules.map(schedule => (
                            <tr key={schedule.schedule_id} className="border-t border-slate-200">
                                <td className="whitespace-nowrap px-3 py-4 font-medium">{schedule.schedule_name}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-xs">{schedule.device_id}</td>
                                <td className="whitespace-nowrap px-3 py-4">{schedule.relay_numbers.map(number => `R${number}`).join(", ")}</td>
                                <td className="px-3 py-4 font-bold">{schedule.target_state}</td>
                                <td className="whitespace-nowrap px-3 py-4">{schedule.start_time} / {schedule.start_date}</td>
                                <td className="whitespace-nowrap px-3 py-4">{schedule.end_time} / {schedule.end_date}</td>
                                <td className="px-3 py-4"><Status value={schedule.status} /></td>
                                <td className="px-3 py-4"><Days days={schedule.days} scheduleType={schedule.schedule_type} startDate={schedule.start_date} /></td>
                                <td className="px-3 py-4"><Actions scheduleId={schedule.schedule_id} deleting={deleting && deleteId === schedule.schedule_id} onDelete={setDeleteId} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <YesNo setAnswer={confirmDelete} show={Boolean(deleteId) && !deleting} message="Delete schedule?" yes="Delete" no="Cancel" />
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}

function Status({ value }: { value: string }) {
    return <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold capitalize ${value === "active" ? "bg-brand-lime text-brand-navy" : "bg-slate-200 text-slate-700"}`}>{value}</span>;
}

function Days({ days, scheduleType, startDate }: { days: string[]; scheduleType?: string; startDate: string }) {
    const selectedDays = scheduleType === "once" ? getDayFromDate(startDate) : days;

    return <div className="flex gap-1">{Object.entries(DAY_LABELS).map(([day, label]) => <span key={day} title={day} className={selectedDays.includes(day) ? "font-bold text-blue-600" : "text-slate-300"}>{label}</span>)}</div>;
}

function getDayFromDate(dateValue: string) {
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return [];

    return [["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]];
}

function Actions({ scheduleId, deleting, onDelete }: { scheduleId: string; deleting: boolean; onDelete: (id: string) => void }) {
    return <div className="flex justify-end gap-2"><Link href={`/dashboard/schedule/${encodeURIComponent(scheduleId)}/edit`} aria-label="Edit schedule" className="rounded-md border border-slate-200 p-2 hover:bg-slate-100"><PencilIcon className="h-5 w-5" /></Link><button type="button" aria-label="Delete schedule" disabled={deleting} onClick={() => onDelete(scheduleId)} className="flex h-[38px] w-[38px] items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-60">{deleting ? <Loading small /> : <TrashIcon className="h-5 w-5" />}</button></div>;
}
