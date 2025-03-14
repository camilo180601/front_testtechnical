"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HabitacionForm } from "@/components/habitacion-form"
import { createHabitacion } from "@/lib/api"
import type { Habitacion } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NuevaHabitacionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const hotelId = searchParams.get("hotel_id")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (data: Omit<Habitacion, "id">) => {
        try {
            setIsSubmitting(true)
            setError(null)
            await createHabitacion(data)

            if (hotelId) {
                router.push(`/hoteles/${hotelId}`)
            } else {
                router.push("/")
            }
        } catch (err) {
            console.error(err)
            setError("Error al crear la habitación. Por favor, intente nuevamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Link
                    href={hotelId ? `/hoteles/${hotelId}` : "/"}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Volver {hotelId ? "al hotel" : "a la lista"}</span>
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Crear Nueva Habitación</h1>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            <div className="max-w-2xl">
                <HabitacionForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    defaultHotelId={hotelId ? Number.parseInt(hotelId) : undefined}
                />
            </div>
        </div>
    )
}