/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/24/outline";
import Loading from "@/app/components/loading";
import { toast } from 'react-toastify';
import { getCookieByNameEndsWith } from "@/app/utils/getCookies";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Appliance({ initialShow = false, text, size = 40, defaultShow, className, switchNumber }: { initialShow?: boolean, text: string, size?: string | number, defaultShow?: boolean, className?: string, switchNumber?: string }) {
    const [show, setShow] = useState(initialShow);
    const [loading, setLoading] = useState(true);
    const [switchClicked, setSwitchClicked] = useState(false);
    const [alias, setAlias] = useState("");
    const deviceId = useSelector((state: any) => state.authReducer.deviceId);

    const getData = async (idToken: string) => {
        await new Promise((resolve, reject) => {
            axios.get(`https://yjvfp0vdp2.execute-api.eu-west-3.amazonaws.com/dev/${deviceId}?switch_name=SW${switchNumber}`, {
                headers: {
                    'Authorization': `${idToken}`
                }
            })
                .then(response => response.data)
                .then(data => {
                    setAlias(data?.switch_alias)
                    setLoading(false);
                    setShow(data?.current_state);
                    resolve(data);
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(`SW${text.replace("SW", "")} error: ` + error?.data || error);
                });
        })
    }

    const postData = async (idToken: string) => {
        const apiData = {
            "device_id": deviceId,
            "switch_name": `SW${switchNumber}`,
            "switch_alias": alias,
            "current_state": show ? 0 : 1
        }
        await new Promise((resolve, reject) => {
            axios.put(`https://yjvfp0vdp2.execute-api.eu-west-3.amazonaws.com/dev/${deviceId}?switch_name=SW${switchNumber}`, apiData, {
                headers: {
                    'Authorization': `${idToken}`
                }
            })
                .then(response => response.data)
                .then(data => {
                    setLoading(false);
                    setSwitchClicked(false);
                    setShow(prevState => !prevState);
                    toast.success(`${text} triggered: ` + data);
                    resolve(data);
                })
                .catch((error) => {
                    setLoading(false);
                    setSwitchClicked(false);
                    toast.error(`${text} error: ` + error?.data || error);
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
        const idToken: any = getCookieByNameEndsWith('idToken');
        if (switchClicked) {
            postData(idToken);
        }
    }, [switchClicked, switchNumber])

    useEffect(() => {
        const idToken: any = getCookieByNameEndsWith('idToken');
        if (switchNumber) {
            getData(idToken);
        } else {
            setLoading(false);
        }
    }, [switchNumber])

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
