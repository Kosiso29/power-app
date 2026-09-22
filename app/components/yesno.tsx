import React from 'react';

export default function YesNo({ message = 'Are you sure?', yes = 'Yes', no = 'No', setAnswer, show }: { message: string, yes: string, no: string, setAnswer: Function, show: boolean }) {
    if (!show) {
        return null;
    };

    return (
        <div className='fixed inset-0 z-30 flex items-center justify-center bg-brand-navy/80 p-4'>
            <div className='brand-panel m-auto w-full max-w-96 p-8'>
                <p className="font-bold text-brand-navy">{message}</p>
                <div className='flex justify-end gap-4 mt-8'>
                    <button className='brand-action-secondary' onClick={() => { setAnswer("no"); show = false; }}>{no}</button>
                    <button className='brand-action' onClick={() => { setAnswer("yes"); show = false; }}>{yes}</button>
                </div>
            </div>
        </div>
    )
}
