"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Habitacion, Hotel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { fetchHoteles } from "@/lib/api"

const habitacionSchema = z.object({
    hotel_id: z.number().int().positive("El hotel es requerido"),
    tipo: z.string().min(1, "El tipo es requerido"),
    cantidad: z.number().int().positive("La cantidad debe ser positiva"),
})

const tiposHabitacion = ["ESTANDAR", "JUNIOR", "SUITE"]

type HabitacionFormData = Omit<Habitacion, "id">

interface HabitacionFormProps {
    initialData?: Habitacion
    onSubmit: (data: HabitacionFormData) => void
    isSubmitting: boolean
    defaultHotelId?: number
}

export function HabitacionForm({ initialData, onSubmit, isSubmitting, defaultHotelId }: HabitacionFormProps) {
    const [formData, setFormData] = useState<HabitacionFormData>({
        hotel_id: initialData?.hotel_id || defaultHotelId || 0,
        tipo: initialData?.tipo || "",
        cantidad: initialData?.cantidad || 1,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [hoteles, setHoteles] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getHoteles = async () => {
            try {
                setLoading(true)
                const data = await fetchHoteles()
                setHoteles(data)
            } catch (err) {
                console.error("Error al cargar hoteles:", err)
            } finally {
                setLoading(false)
            }
        }

        getHoteles()
    }, [])

    useEffect(() => {
        if (defaultHotelId) {
            setFormData((prev) => ({
                ...prev,
                hotel_id: defaultHotelId,
            }))
        }
    }, [defaultHotelId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value ? Number.parseInt(value) : 0) : value,
        }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: name === "hotel_id" ? Number.parseInt(value) : value,
        }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        try {
            habitacionSchema.parse(formData)
            onSubmit(formData)
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors: Record<string, string> = {}
                err.errors.forEach((error) => {
                    if (error.path[0]) {
                        newErrors[error.path[0].toString()] = error.message
                    }
                })
                setErrors(newErrors)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="hotel_id">Hotel</Label>
                <Select
                    value={formData.hotel_id.toString()}
                    onValueChange={(value) => handleSelectChange("hotel_id", value)}
                    disabled={loading || !!defaultHotelId}
                >
                    <SelectTrigger className={errors.hotel_id ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar hotel" />
                    </SelectTrigger>
                    <SelectContent>
                        {hoteles.map((hotel) => (
                            <SelectItem key={hotel.id} value={hotel.id.toString()}>
                                {hotel.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.hotel_id && <p className="text-red-500 text-sm">{errors.hotel_id}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Habitación</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                    <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        {tiposHabitacion.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                                {tipo}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                    id="cantidad"
                    name="cantidad"
                    type="number"
                    value={formData.cantidad}
                    onChange={handleChange}
                    placeholder="Cantidad de habitaciones"
                    min="1"
                    className={errors.cantidad ? "border-red-500" : ""}
                />
                {errors.cantidad && <p className="text-red-500 text-sm">{errors.cantidad}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : initialData ? "Actualizar Habitación" : "Crear Habitación"}
            </Button>
        </form>
    )
}