"use client"

import { useEffect, useState } from "react"
import type { Hotel } from "@/lib/types"
import { fetchHoteles } from "@/lib/api"
import { HotelCard } from "@/components/hotel-card"
import { Skeleton } from "@/components/ui/skeleton"

export function HotelList() {
    const [hoteles, setHoteles] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const getHoteles = async () => {
            try {
                setLoading(true)
                const data = await fetchHoteles()
                setHoteles(data)
                setError(null)
            } catch (err) {
                setError("Error al cargar los hoteles. Intente nuevamente.")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        getHoteles()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-6">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="flex justify-end space-x-2">
                            <Skeleton className="h-9 w-20" />
                            <Skeleton className="h-9 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
    }

    if (hoteles.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-600">No hay hoteles registrados</h2>
                <p className="text-gray-500 mt-2">Crea un nuevo hotel para comenzar</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hoteles.map((hotel) => (
                <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onDelete={() => {
                        setHoteles(hoteles.filter((h) => h.id !== hotel.id))
                    }}
                />
            ))}
        </div>
    )
}