/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/24/outline";
import Loading from "@/app/components/loading";
import { toast } from 'react-toastify';
import axios from "axios";

const relayBySwitchNumber: Record<string, string> = { "1": "relay1", "2": "relay2", "17": "relay1", "22": "relay2" };

export default function Appliance({ initialShow = false, text, size = 40, defaultShow, className, switchNumber, onStateChange }: { initialShow?: boolean, text: string, size?: string | number, defaultShow?: boolean, className?: string, switchNumber?: string, onStateChange?: (state: boolean) => void }) {
    const [show, setShow] = useState(initialShow);
    const [loading, setLoading] = useState(true);
    const [switchClicked, setSwitchClicked] = useState(false);
    const [alias, setAlias] = useState("");

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
        <div className='flex flex-col justify-center items-center'>
            <div onClick={handleClick} className={`flex justify-center items-center p-2 rounded-full cursor-pointer mb-1 ${show || defaultShow ? 'bg-primary' : 'bg-gray-400'} ${loading ? 'bg-transparent' : ''} ${className}`}>
                {
                    loading ? <div className='flex justify-center items-center' style={{ width: size, height: size }}><Loading small /></div> :
                        <LightBulbIcon color='white' width={size} height={size} />
                }
            </div>
            <span className='text-center'>{loading ? alias || "---" : alias || text}</span>
        </div>
    )
}
