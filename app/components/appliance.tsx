import React, { useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/24/outline";

export default function Appliance({ initialShow = false, text }: { initialShow: boolean, text: string }) {
    const [show, setShow] = useState(initialShow);

    const handleClick = () => {
        setShow(prevState => !prevState);
    }
    return (
        <div className='flex flex-col justify-center items-center w-24 h-24 mb-4'>
            <div onClick={handleClick} className={`flex justify-center items-center w-16 h-16 rounded-full cursor-pointer ${show ? 'bg-primary': 'bg-gray-400'}`}>
                <LightBulbIcon color='white' width={40} height={40} />
            </div>
            <span className='text-center'>{ text }</span>
        </div>
    )
}
