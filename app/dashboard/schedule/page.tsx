// @ts-nocheck
'use client'

import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import PrimaryButton from "../../ui/button";
import Table from "../../components/table";
import Search from "../../components/search";
import { useEffect, useState } from "react";
import axios from "axios";

// const schedules = [
//     {
//         id: 'e200643f-9d62-4b38-9f22-eaadcdd96aac',
//         amount: 2023,
//         date: 2023,
//         status: 'inactive',
//         frequency: 'one time',
//         name: 'Automatic',
//         email: 'Turn off lights at nights',
//         image_url: '/customers/evil-rabbit.png'
//     },
//     {
//         id: 'e200643f',
//         amount: 2023,
//         date: 2023,
//         status: 'inactive',
//         frequency: 'recurring',
//         name: 'Manual',
//         email: 'Regulate first and second fridge',
//         image_url: '/customers/evil-rabbit.png'
//     },
//     {
//         id: 'e200643f-9d62',
//         amount: 2023,
//         date: 2023,
//         status: 'inactive',
//         frequency: 'one time',
//         name: 'Automatic',
//         email: 'Turn on the fridge 4 hours a day',
//         image_url: '/customers/evil-rabbit.png'
//     },
//     {
//         id: 'e200643f-9d62-4b38',
//         amount: 2023,
//         date: 2023,
//         status: 'active',
//         frequency: 'recurring',
//         name: 'Manual',
//         email: 'Turn off all appliances on work/school days',
//         image_url: '/customers/evil-rabbit.png'
//     },
//     {
//         id: 'e200643f-9d62-4b38-9f22',
//         amount: 2023,
//         date: 2023,
//         status: 'active',
//         frequency: 'one time',
//         name: 'Manual',
//         email: 'Turn on security light at nights',
//         image_url: '/customers/evil-rabbit.png'
//     },
//     {
//         id: '9d62-4b38-9f22-eaadcdd96aac',
//         amount: 2023,
//         date: 2023,
//         status: 'active',
//         frequency: 'one time',
//         name: 'Automatic',
//         email: 'Shut down the house at low available power',
//         image_url: '/customers/evil-rabbit.png'
//     },
// ];

export default function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const getData = async () => {
        await new Promise((resolve, reject) => {
            axios.get('https://lngupzkavsgkbbrqvnmbc4prxa0shinh.lambda-url.eu-west-3.on.aws/')
                .then(response => response.data)
                .then(data => {
                    console.log('data', data.schedules);
                    setSchedules(data.schedules);
                    resolve();
                })
                .catch(() => reject());
        })
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Schedule
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-16">
                <Search placeholder="Search schedules..." />
                <Link
                href="/dashboard/schedule/create"
                className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                <span className="hidden md:block">Create Schedule</span>{' '}
                <PlusIcon className="h-5 md:ml-4" />
                </Link>
            </div>
            <div className='bg-white w-full mt-8 rounded-lg md:p-8 py-8 px-2 h-auto'>
                <Table schedules={schedules} />
            </div>
        </div>
    );
}