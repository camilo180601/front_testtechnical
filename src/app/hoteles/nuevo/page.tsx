"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HotelForm } from "@/components/hotel-form"
import { createHotel } from "@/lib/api"
import type { Hotel } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NuevoHotelPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (data: Omit<Hotel, "id">) => {
        try {
            setIsSubmitting(true)
            setError(null)
            await createHotel(data)
            router.push("/")
        } catch (err) {
            console.error(err)
            setError("Error al crear el hotel. Por favor, intente nuevamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Volver a la lista</span>
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Crear Nuevo Hotel</h1>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            <div className="max-w-2xl">
                <HotelForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    )
}

