import type React from "react"
// Opción 1: Usando un botón con estilos transparentes
interface ButtonWrapperProps {
    onClick: () => void
    children: React.ReactNode
    className?: string
}

export function ButtonWrapper({ onClick, children, className = "" }: ButtonWrapperProps) {
    return (
        <button
            onClick={onClick}
            className={`block w-full appearance-none bg-transparent border-0 p-0 m-0 cursor-pointer ${className}`}
        >
            {children}
        </button>
    )
}

// Opción 2: Usando un div con role="button"
export function ButtonWrapperDiv({ onClick, children, className = "" }: ButtonWrapperProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    onClick()
                }
            }}
            className={`cursor-pointer ${className}`}
        >
            {children}
        </div>
    )
}