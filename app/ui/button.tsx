import type { ButtonHTMLAttributes } from 'react'

export default function Button({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className={`px-3 rounded-lg text-white hover:bg-primary-hover active:bg-primary-active py-2 w-full ${className}`}>
            { children }
        </button>
    )
}
