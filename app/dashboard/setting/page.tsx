'use client'

import React, { FormEvent, useState } from 'react'
import { ArrowPathIcon, CheckCircleIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Setting() {
    const router = useRouter();
    const [deviceId, setDeviceId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const claimDevice = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedDeviceId = deviceId.trim();
        if (!normalizedDeviceId) {
            setSuccess(false);
            setMessage("Enter the Device ID printed on your Cyberwatt device.");
            return;
        }

        setLoading(true);
        setSuccess(false);
        setMessage("");

        try {
            const response = await fetch("/api/devices/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ device_id: normalizedDeviceId }),
            });
            const responseText = await response.text();
            let responseData: { message?: string; error?: string } = {};

            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch {
                responseData = {};
            }

            if (!response.ok) {
                const fallbackMessages: Record<number, string> = {
                    400: "That Device ID is invalid.",
                    401: "Your session has expired. Please sign in again.",
                    403: "You are not authorized to claim this device.",
                    404: "No device was found with that Device ID.",
                    409: "This device has already been claimed by another user.",
                };
                throw new Error(responseData.message || responseData.error || fallbackMessages[response.status] || "The device could not be claimed.");
            }

            setSuccess(true);
            setMessage(responseData.message || "Device claimed successfully. Refreshing your dashboard...");
            setDeviceId("");
            router.refresh();
            window.setTimeout(() => window.location.assign("/dashboard"), 1200);
        } catch (error) {
            setSuccess(false);
            setMessage(error instanceof Error ? error.message : "The device could not be claimed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-[1440px]">
            <p className="text-xs font-black uppercase text-brand-cyan">Preferences</p>
            <h1 className="mt-2 text-3xl font-black text-brand-navy sm:text-4xl">Settings</h1>
            <section className="brand-panel mt-8 max-w-3xl p-5 sm:p-7">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-brand-cyan">
                        <LinkIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-brand-navy">Claim Device</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">Link a Cyberwatt device to your account using the Device ID printed on it.</p>
                    </div>
                </div>
                <form className="mt-6" onSubmit={claimDevice}>
                    <label htmlFor="deviceId" className="mb-2 block text-sm font-bold text-brand-navy">Device ID</label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            id="deviceId"
                            name="device_id"
                            type="text"
                            value={deviceId}
                            onChange={(event) => setDeviceId(event.target.value)}
                            disabled={loading || success}
                            autoComplete="off"
                            placeholder="Enter Device ID"
                            className="min-h-11 flex-1 rounded-lg border px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        <button type="submit" disabled={loading || success || !deviceId.trim()} className="brand-action min-h-11 shrink-0 sm:min-w-40">
                            {loading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : success ? <CheckCircleIcon className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
                            {loading ? "Claiming..." : success ? "Claimed" : "Claim Device"}
                        </button>
                    </div>
                    {message && (
                        <div role={success ? "status" : "alert"} className={`mt-4 rounded-lg border px-4 py-3 text-sm leading-6 ${success ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-rose-400/30 bg-rose-400/10 text-rose-300"}`}>
                            {message}
                        </div>
                    )}
                </form>
            </section>
        </div>
    )
}
