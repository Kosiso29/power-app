import type { ButtonHTMLAttributes } from 'react'

export default function Button({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className={`brand-action w-full ${className}`}>
            { children }
        </button>
    )
}
