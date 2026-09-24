/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { toast } from 'react-toastify';
import axios from "axios";

const relayBySwitchNumber: Record<string, string> = { "1": "relay1", "2": "relay2", "17": "relay1", "22": "relay2" };

export default function Appliance({ initialShow = false, text, size = 40, defaultShow, className, switchNumber, onStateChange }: { initialShow?: boolean, text: string, size?: string | number, defaultShow?: boolean, className?: string, switchNumber?: string, onStateChange?: (state: boolean) => void }) {
    const [show, setShow] = useState(initialShow);
    const [loading, setLoading] = useState(true);
    const [switchClicked, setSwitchClicked] = useState(false);
    const [alias, setAlias] = useState("");
    const baseIconSize = typeof size === "number" ? size : Number.parseInt(size, 10) || 40;
    const isPrimaryControl = baseIconSize >= 40;
    const iconSize = isPrimaryControl ? baseIconSize + 14 : baseIconSize;
    const buttonSize = iconSize + (isPrimaryControl ? 24 : 8);

    const getRelayName = () => {
        if (!switchNumber) {
            return null;
        }

        return relayBySwitchNumber[switchNumber] || null;
    }

    const postData = async () => {
        const relayName = getRelayName();

        if (!relayName) {
            setLoading(false);
            setSwitchClicked(false);
            toast.error(`${text} is not connected to the relay API`);
            return;
        }

        const nextState = !show;
        const apiData = {
            [relayName]: nextState,
        };

        await new Promise((resolve, reject) => {
            axios.post('/api/switch', apiData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.data)
                .then(data => {
                    const returnedState = typeof data?.[relayName] === "boolean" ? data[relayName] : nextState;

                    setLoading(false);
                    setSwitchClicked(false);
                    setShow(returnedState);
                    onStateChange?.(returnedState);
                    toast.success(`${alias || text} turned ${returnedState ? 'on' : 'off'}`);
                    resolve(data);
                })
                .catch((error) => {
                    setLoading(false);
                    setSwitchClicked(false);
                    toast.error(`${alias || text} error: ${error?.response?.data?.error || error?.response?.data?.message || error?.message || error}`);
                });
        })
    }

    const handleClick = () => {
        if (defaultShow === undefined && switchNumber) {
            setLoading(true);
            setSwitchClicked(true);
        } else if (defaultShow === undefined) {
            setShow(prevState => !prevState);
        }
    }

    useEffect(() => {
        if (switchClicked) {
            postData();
        }
    }, [switchClicked, switchNumber])

    useEffect(() => {
        if (switchNumber) {
            setAlias(`Relay ${switchNumber}`);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [switchNumber])

    useEffect(() => {
        if (defaultShow === undefined) {
            setShow(initialShow);
        }
    }, [initialShow, defaultShow])

    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            <button
                type="button"
                onClick={handleClick}
                disabled={loading}
                aria-busy={loading}
                aria-label={`${show || defaultShow ? 'Turn off' : 'Turn on'} ${alias || text}`}
                style={{ width: buttonSize, height: buttonSize }}
                className={`relative flex shrink-0 items-center justify-center rounded-full border p-3 transition-all disabled:cursor-wait ${show || defaultShow ? 'border-cyan-300 bg-brand-cyan text-brand-navy shadow-[0_0_24px_rgba(6,182,212,0.28)]' : 'border-slate-500 bg-slate-500 text-slate-900 shadow-inner hover:border-slate-400 hover:bg-slate-400'} ${className}`}
            >
                {loading && (
                    <span
                        aria-hidden="true"
                        className="absolute inset-1.5 animate-spin rounded-full border-2 border-black/20 border-t-black/80"
                    />
                )}
                <Image
                    src="/cyberwatt-logo.png"
                    width={iconSize}
                    height={iconSize}
                    alt=""
                    className={`brightness-0 transition-[transform,opacity] duration-200 ${loading ? 'scale-90 opacity-60' : 'scale-100 opacity-100'}`}
                />
            </button>
            <span className='text-center text-sm font-semibold'>{loading ? alias || "---" : alias || text}</span>
            {switchNumber && (
                <span className={`min-h-4 text-[.65rem] font-black uppercase transition-opacity ${show ? 'text-brand-lime' : 'text-slate-400'} ${loading ? 'opacity-60' : 'opacity-100'}`}>
                    {show ? 'On' : 'Off'}
                </span>
            )}
        </div>
    )
}
