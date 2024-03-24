'use client'

import Form from "@/app/components/form";

export default function Page() {
    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Create Schedule
            </h1>
            <div className='bg-white w-full mt-8 rounded-lg md:p-8 py-8 px-2 h-auto'>
                <Form />
            </div>
        </div>
    );
}
