"use client"

import type { Hotel } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Hash, Bed } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { deleteHotel } from "@/lib/api"
import { DeleteConfirmation } from "@/components/delete-confirmation"

interface HotelCardProps {
    hotel: Hotel
    onDelete: () => void
}

export function HotelCard({ hotel, onDelete }: HotelCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteHotel(hotel.id)
            onDelete()
        } catch (error) {
            console.error("Error al eliminar el hotel:", error)
        } finally {
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-start justify-between">
                    <span className="truncate">{hotel.nombre}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                        <p className="text-sm text-gray-700">{hotel.direccion}</p>
                        <p className="text-sm font-medium">{hotel.ciudad}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm text-gray-700">{hotel.nit}</p>
                </div>
                <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm text-gray-700">{hotel.numero_habitaciones} habitaciones</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                <Link href={`/hoteles/${hotel.id}`}>
                    <Button variant="outline" size="sm">
                        Ver detalles
                    </Button>
                </Link>
                <Link href={`/hoteles/editar/${hotel.id}`}>
                    <Button variant="outline" size="sm">
                        Editar
                    </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                </Button>
            </CardFooter>

            <DeleteConfirmation
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Eliminar Hotel"
                description={`¿Estás seguro que deseas eliminar el hotel "${hotel.nombre}"? Esta acción no se puede deshacer.`}
            />
        </Card>
    )
}