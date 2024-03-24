'use client'

import { useState } from "react";
import Link from 'next/link';
import {
    CheckIcon,
    ClockIcon,
    UserCircleIcon,
    CalendarIcon,
    XMarkIcon,
    ArrowPathRoundedSquareIcon,
    ArrowUturnDownIcon
} from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import Loading from "@/app/components/loading";
import Form from "@/app/components/form";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Edit Schedule
            </h1>
            <div className='bg-white w-full mt-8 rounded-lg md:p-8 py-8 px-2 h-auto'>
                <Form />
            </div>
            <ToastContainer autoClose={3500} position="top-right" />
        </div>
    );
}
