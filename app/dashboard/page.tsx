import React from 'react'
import Button from "../ui/button";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className='h-screen'>
            <h1 className='text-4xl text-primary'>
                Dashboard
            </h1>
            <div className="flex justify-between w-full mt-16">
                <div className='basis-[45%] bg-white h-80 rounded-lg'></div>
                <div className='basis-[45%] bg-white h-80 rounded-lg'></div>
            </div>
            <div className='bg-white w-full mt-16 h-80 rounded-lg'></div>
            {/* <Link href="/">
                <Button className="bg-primary">Logout</Button>
            </Link> */}
        </div>
    )
}
