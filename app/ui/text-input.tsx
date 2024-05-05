import React from 'react'

export default function TextInput({ type, value, onChange, placeholder, className }: { type: string, value: string, onChange: Function, placeholder: string, className: string }) {
    return (
        <input className={`bg-transparent border-primary border-b-2 px-3 py-2 focus-visible:outline-none placeholder-[#DDDDDD] ${className}`} type={type} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} placeholder={placeholder} />
    )
}
