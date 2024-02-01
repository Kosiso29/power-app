import React from 'react'

export default function TextInput({ type, value, onChange, placeholder }: { type: string, value: string, onChange: Function, placeholder: string }) {
    return (
        <input className="bg-transparent border-b-2 text-white border-white px-3 py-2 focus-visible:outline-none placeholder-[#DDDDDD]" type={type} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} placeholder={placeholder} />
    )
}
