'use client'

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export type Schedule = {
    schedule_id: string;
    device_id: string;
    schedule_name: string;
    schedule_type?: string;
    relay_numbers: number[];
    target_state: "ON" | "OFF";
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    timezone: string;
    days: string[];
    status: "active" | "inactive";
};

type Device = { device_id: string; product?: string | null; relay_count?: number | null };

const DAYS = [
    ["MON", "Monday"], ["TUE", "Tuesday"], ["WED", "Wednesday"],
    ["THU", "Thursday"], ["FRI", "Friday"], ["SAT", "Saturday"], ["SUN", "Sunday"],
] as const;

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "The schedule could not be saved.";
}

export default function Form({ schedule }: { schedule?: Schedule }) {
    const router = useRouter();
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(schedule?.device_id || "");
    const [scheduleType, setScheduleType] = useState(schedule?.schedule_type || "recurring");
    const [devicesLoading, setDevicesLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";

    useEffect(() => {
        let active = true;
        fetch("/api/devices", { cache: "no-store" })
            .then(async response => {
                const body = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(body.message || "Unable to load your devices.");
                return Array.isArray(body) ? body : body.devices || body.items || [];
            })
            .then(items => {
                if (!active) return;
                setDevices(items);
                if (!schedule?.device_id && items.length > 0) {
                    const storedId = window.localStorage.getItem("cyberwatt.activeDeviceId");
                    const initialId = items.some((item: Device) => item.device_id === storedId) ? storedId : items[0].device_id;
                    setSelectedDeviceId(initialId || "");
                }
            })
            .catch(error => active && toast.error(getErrorMessage(error)))
            .finally(() => active && setDevicesLoading(false));
        return () => { active = false; };
    }, [schedule?.device_id]);

    const selectedDevice = devices.find(device => device.device_id === selectedDeviceId);
    const relayCount = Math.max(1, selectedDevice?.relay_count || 8);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (loading) return;

        const formData = new FormData(event.currentTarget);
        const relayNumbers = formData.getAll("relay_numbers").map(Number);
        const selectedScheduleType = String(formData.get("schedule_type") || "recurring");
        const days = selectedScheduleType === "recurring" ? formData.getAll("days").map(String) : [];
        if (!relayNumbers.length || (selectedScheduleType === "recurring" && !days.length)) {
            toast.error(!relayNumbers.length ? "Select at least one relay." : "Select at least one day for a recurring schedule.");
            return;
        }

        const payload = {
            device_id: String(formData.get("device_id") || ""),
            schedule_name: String(formData.get("schedule_name") || "").trim(),
            schedule_type: selectedScheduleType,
            relay_numbers: relayNumbers,
            target_state: String(formData.get("target_state")),
            start_date: String(formData.get("start_date")),
            end_date: String(formData.get("end_date")),
            start_time: String(formData.get("start_time")),
            end_time: String(formData.get("end_time")),
            timezone: String(formData.get("timezone") || defaultTimezone),
            days,
            status: String(formData.get("status")),
        };

        setLoading(true);
        try {
            const endpoint = schedule ? `/api/schedules/${encodeURIComponent(schedule.schedule_id)}` : "/api/schedules";
            const response = await fetch(endpoint, {
                method: schedule ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(body.message || body.error || "The schedule could not be saved.");

            toast.success(body.message || `Schedule ${schedule ? "updated" : "created"} successfully.`);
            router.push("/dashboard/schedule");
            router.refresh();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20";

    return (
        <form onSubmit={submit}>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-brand-navy md:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                    <label className="block text-sm font-medium">
                        <span className="mb-2 block">Device</span>
                        <select name="device_id" required value={selectedDeviceId} onChange={event => setSelectedDeviceId(event.target.value)} disabled={devicesLoading} className={inputClass}>
                            <option value="" disabled>{devicesLoading ? "Loading devices..." : "Select a device"}</option>
                            {devices.map(device => <option key={device.device_id} value={device.device_id}>{device.product ? `${device.product} - ` : ""}{device.device_id}</option>)}
                        </select>
                    </label>
                    <label className="block text-sm font-medium">
                        <span className="mb-2 block">Schedule name</span>
                        <input name="schedule_name" required maxLength={100} defaultValue={schedule?.schedule_name} placeholder="Evening lighting" className={inputClass} />
                    </label>
                </div>

                <label className="mt-5 block text-sm font-medium">
                    <span className="mb-2 block">Schedule type</span>
                    <select name="schedule_type" required value={scheduleType} onChange={event => setScheduleType(event.target.value)} className={inputClass}>
                        <option value="recurring">Recurring</option>
                        <option value="once">Once</option>
                    </select>
                </label>

                <fieldset className="mt-5">
                    <legend className="mb-2 text-sm font-medium">Relays</legend>
                    <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 bg-white p-3">
                        {Array.from({ length: relayCount }, (_, index) => index + 1).map(relay => (
                            <label key={relay} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
                                <input name="relay_numbers" type="checkbox" value={relay} defaultChecked={schedule?.relay_numbers.includes(relay)} className="h-4 w-4 accent-blue-600" /> Relay {relay}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <RadioField legend="Target state" name="target_state" values={["ON", "OFF"]} selected={schedule?.target_state || "OFF"} />
                    <RadioField legend="Status" name="status" values={["active", "inactive"]} selected={schedule?.status || "active"} />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <DateTimeField icon="date" label="Start date" name="start_date" type="date" value={schedule?.start_date || today} inputClass={inputClass} />
                    <DateTimeField icon="date" label="End date" name="end_date" type="date" value={schedule?.end_date || today} inputClass={inputClass} />
                    <DateTimeField icon="time" label="Start time" name="start_time" type="time" value={schedule?.start_time || "18:30"} inputClass={inputClass} />
                    <DateTimeField icon="time" label="End time" name="end_time" type="time" value={schedule?.end_time || "23:00"} inputClass={inputClass} />
                </div>

                <label className="mt-5 block text-sm font-medium">
                    <span className="mb-2 block">Timezone</span>
                    <input name="timezone" required defaultValue={schedule?.timezone || defaultTimezone} className={inputClass} />
                </label>

                {scheduleType === "recurring" && (
                    <fieldset className="mt-5">
                        <legend className="mb-2 text-sm font-medium">Days</legend>
                        <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 bg-white p-3">
                            {DAYS.map(([value, label]) => (
                                <label key={value} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
                                    <input name="days" type="checkbox" value={value} defaultChecked={schedule?.days.includes(value)} className="h-4 w-4 accent-blue-600" /> {label}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                )}
            </div>

            <div className="mt-6 flex justify-center gap-4 md:justify-end">
                <Link href="/dashboard/schedule" className="brand-action-secondary">Cancel</Link>
                <button type="submit" disabled={loading || devicesLoading || !devices.length} className="brand-action disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Saving..." : schedule ? "Update Schedule" : "Create Schedule"}
                </button>
            </div>
        </form>
    );
}

function RadioField({ legend, name, values, selected }: { legend: string; name: string; values: readonly string[]; selected: string }) {
    return <fieldset><legend className="mb-2 text-sm font-medium">{legend}</legend><div className="flex h-[42px] items-center gap-5 rounded-md border border-slate-200 bg-white px-3 text-sm">{values.map(value => <label key={value} className="flex cursor-pointer items-center gap-2 capitalize"><input name={name} type="radio" value={value} defaultChecked={selected === value} className="accent-blue-600" />{value}</label>)}</div></fieldset>;
}

function DateTimeField({ label, name, type, value, icon, inputClass }: { label: string; name: string; type: "date" | "time"; value: string; icon: "date" | "time"; inputClass: string }) {
    const Icon = icon === "date" ? CalendarIcon : ClockIcon;
    return <label className="block text-sm font-medium"><span className="mb-2 block">{label}</span><span className="relative block"><input name={name} type={type} required defaultValue={value} className={`${inputClass} pl-10`} /><Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" /></span></label>;
}
