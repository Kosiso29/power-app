import React from 'react'

export default function Loading({ small }: { small?: boolean }) {
    if (small) {
        return (
            <div className='w-full'>
                <div className='b border-[4px] border-t-[4px] border-primary border-t-transparent rounded-full w-5 h-5 animate-spin ml-auto mr-auto'></div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='b border-[6px] border-t-[6px] border-primary border-t-transparent rounded-full w-16 h-16 animate-spin ml-auto mr-auto'></div>
        </div>
    )
}
