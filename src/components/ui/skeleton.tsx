import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Opcional: Define una variante específica del skeleton
     */
    variant?: "default" | "circle" | "text" | "title" | "image" | "card"
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted",
                {
                    "h-4 w-full": variant === "text",
                    "h-6 w-3/4": variant === "title",
                    "h-12 w-12 rounded-full": variant === "circle",
                    "h-[200px] w-full": variant === "image",
                    "h-[300px] w-full rounded-lg": variant === "card",
                },
                className,
            )}
            {...props}
        />
    )
}

/**
 * Componente para mostrar un grupo de skeletons de texto
 */
function SkeletonText({ className, lines = 3, ...props }: { lines?: number } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("space-y-2", className)} {...props}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    className={cn(i === lines - 1 && lines > 1 ? "w-4/5" : "", i === 0 && lines > 1 ? "w-full" : "")}
                />
            ))}
        </div>
    )
}

/**
 * Componente para mostrar un skeleton de tarjeta con título y contenido
 */
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("rounded-lg border p-4 shadow-sm", className)} {...props}>
            <div className="space-y-3">
                <Skeleton variant="title" />
                <SkeletonText lines={2} />
            </div>
        </div>
    )
}

/**
 * Componente para mostrar un skeleton de avatar con texto
 */
function SkeletonAvatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex items-center space-x-4", className)} {...props}>
            <Skeleton variant="circle" className="h-10 w-10" />
            <div className="space-y-2">
                <Skeleton variant="text" className="h-4 w-[250px]" />
                <Skeleton variant="text" className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

/**
 * Componente para mostrar un skeleton de tabla
 */
function SkeletonTable({
    className,
    rows = 5,
    columns = 3,
    ...props
}: {
    rows?: number
    columns?: number
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("w-full rounded-md border", className)} {...props}>
            {/* Header */}
            <div className="border-b p-4">
                <div className="flex space-x-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <Skeleton key={i} className="h-6 flex-1" />
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="p-4">
                        <div className="flex space-x-4">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <Skeleton key={colIndex} className="h-4 flex-1" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonTable }