"use client"

import type { Habitacion } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HabitacionesListProps {
    habitaciones: Habitacion[]
    hotelId: number
}

export function HabitacionesList({ habitaciones, hotelId }: HabitacionesListProps) {
    if (!habitaciones || habitaciones.length === 0) {
        return (
            <div className="text-center py-8">
                <Bed className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay habitaciones</h3>
                <p className="mt-1 text-sm text-gray-500">Comienza agregando una nueva habitación.</p>
                <div className="mt-6">
                    <Link href={`/habitaciones/nueva?hotel_id=${hotelId}`}>
                        <Button>Añadir Habitación</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {habitaciones.map((habitacion) => (
                <Card key={habitacion.id}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Bed className="h-5 w-5" />
                                <span>{habitacion.tipo}</span>
                            </div>
                            <Badge variant="secondary">{habitacion.cantidad} unidades</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Acomodaciones:</h4>
                            {habitacion.acomodaciones && habitacion.acomodaciones.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {habitacion.acomodaciones.map((acomodacion, index) => (
                                        <Badge key={index} variant="outline" className="flex items-center space-x-1">
                                            <Users className="h-3 w-3" />
                                            <span>{acomodacion.tipo}</span>
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No hay acomodaciones configuradas</p>
                            )}
                            <div className="mt-4">
                                <Link href={`/acomodaciones/nueva?habitacion_id=${habitacion.id}`}>
                                    <Button variant="outline" size="sm">
                                        Añadir Acomodación
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <div className="mt-4">
                <Link href={`/habitaciones/nueva?hotel_id=${hotelId}`}>
                    <Button>Añadir Habitación</Button>
                </Link>
            </div>
        </div>
    )
}