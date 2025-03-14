"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AcomodacionForm } from "@/components/acomodacion-form"
import { createAcomodacion } from "@/lib/api"
import type { Acomodacion } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NuevaAcomodacionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const habitacionId = searchParams.get("habitacion_id")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (data: Omit<Acomodacion, "id">) => {
        try {
            setIsSubmitting(true)
            setError(null)
            await createAcomodacion(data)
            router.back() // Volver a la página anterior
        } catch (err) {
            console.error(err)
            setError("Error al crear la acomodación. Por favor, intente nuevamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Volver</span>
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Crear Nueva Acomodación</h1>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            <div className="max-w-2xl">
                <AcomodacionForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    defaultHabitacionId={habitacionId ? Number.parseInt(habitacionId) : undefined}
                />
            </div>
        </div>
    )
}