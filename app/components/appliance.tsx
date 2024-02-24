import React, { useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/24/outline";

export default function Appliance({ initialShow = false, text, size = 40, defaultShow, className }: { initialShow?: boolean, text: string, size?: string | number, defaultShow?: boolean, className: string }) {
    const [show, setShow] = useState(initialShow);

    const handleClick = () => {
        if (defaultShow === undefined) {
            setShow(prevState => !prevState);
        }
    }
    return (
        <div className='flex flex-col justify-center items-center'>
            <div onClick={handleClick} className={`flex justify-center items-center p-2 rounded-full cursor-pointer mb-1 ${show || defaultShow ? 'bg-primary': 'bg-gray-400'} ${className}`}>
                <LightBulbIcon color='white' width={size} height={size} />
            </div>
            <span className='text-center'>{ text }</span>
        </div>
    )
}
