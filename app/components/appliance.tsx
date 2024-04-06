/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/24/outline";
import Loading from "@/app/components/loading";
import { toast } from 'react-toastify';
import axios from "axios";

export default function Appliance({ initialShow = false, text, size = 40, defaultShow, className, switchNumber }: { initialShow?: boolean, text: string, size?: string | number, defaultShow?: boolean, className?: string, switchNumber?: string }) {
    const [show, setShow] = useState(initialShow);
    const [loading, setLoading] = useState(false);


    const postData = async () => {
        const apiData = {
            "device_id": "12a34b56c78d9",
            "switch": switchNumber,
            "state": show ? 0 : 1
        }
        await new Promise((resolve, reject) => {
            axios.post(`https://31ei84b150.execute-api.eu-west-3.amazonaws.com/dev/switch`, apiData)
                .then(response => response.data)
                .then(data => {
                    setLoading(false);
                    setShow(prevState => !prevState);
                    toast.success(`SW${text.replace("SW", "")} triggered: ` + data);
                    resolve(data);
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(`SW${text.replace("SW", "")} error: ` + error?.data || error);
                });
        })
    }

    const handleClick = () => {
        if (defaultShow === undefined && switchNumber) {
            setLoading(true);
        } else if (defaultShow === undefined) {
            setShow(prevState => !prevState);
        }
    }

    useEffect(() => {
        if (loading) {
            postData();
        }
    }, [loading, switchNumber])

    return (
        <div className='flex flex-col justify-center items-center'>
            <div onClick={handleClick} className={`flex justify-center items-center p-2 rounded-full cursor-pointer mb-1 ${show || defaultShow ? 'bg-primary' : 'bg-gray-400'} ${loading ? 'bg-transparent' : ''} ${className}`}>
                {
                    loading ? <div className='flex justify-center items-center' style={{ width: size, height: size }}><Loading small /></div> :
                        <LightBulbIcon color='white' width={size} height={size} />
                }
            </div>
            <span className='text-center'>{text}</span>
        </div>
    )
}
