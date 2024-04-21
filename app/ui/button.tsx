// @ts-nocheck
import React from 'react'

export default function Button({ className, children, onClick }: { className?: string, children: React.ReactNode }) {
    return (
        <button onClick={onClick} className={`px-3 rounded-lg text-white hover:bg-primary-hover active:bg-primary-active py-2 w-full ${className}`}>
            { children }
        </button>
    )
}
