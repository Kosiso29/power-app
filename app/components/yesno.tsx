import React from 'react';

export default function YesNo({ message = 'Are you sure?', yes = 'Yes', no = 'No', setAnswer, show }: { message: string, yes: string, no: string, setAnswer: Function, show: boolean }) {
    if (!show) {
        return null;
    };

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/80 z-10 flex justify-center items-center'>
            <div className='bg-white p-10 rounded-lg shadow-lg w-96 m-auto'>
                <p>{message}</p>
                <div className='flex justify-end gap-4 mt-8'>
                    <button className='text-primary border border-primary rounded-lg px-5 py-2' onClick={() => { setAnswer("no"); show = false; }}>{no}</button>
                    <button className='bg-primary text-white rounded-lg px-5 py-2' onClick={() => { setAnswer("yes"); show = false; }}>{yes}</button>
                </div>
            </div>
        </div>
    )
}
