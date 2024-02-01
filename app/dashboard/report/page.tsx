import React from 'react'
import Button from "../../ui/button";
import Link from "next/link";

export default function Report() {
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1>
                Report
            </h1>
            <Link href="/">
                <Button className="bg-primary">Logout</Button>
            </Link>
        </div>
    )
}
