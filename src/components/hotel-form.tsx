"use client"

import type React from "react"

import { useState } from "react"
import type { Hotel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"

const hotelSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    direccion: z.string().min(1, "La dirección es requerida"),
    ciudad: z.string().min(1, "La ciudad es requerida"),
    nit: z.string().min(1, "El NIT es requerido"),
    numero_habitaciones: z.number().int().positive("El número de habitaciones debe ser positivo"),
})

type HotelFormData = Omit<Hotel, "id">

interface HotelFormProps {
    initialData?: Hotel
    onSubmit: (data: HotelFormData) => void
    isSubmitting: boolean
}

export function HotelForm({ initialData, onSubmit, isSubmitting }: HotelFormProps) {
    const [formData, setFormData] = useState<HotelFormData>({
        nombre: initialData?.nombre || "",
        direccion: initialData?.direccion || "",
        ciudad: initialData?.ciudad || "",
        nit: initialData?.nit || "",
        numero_habitaciones: initialData?.numero_habitaciones || 0,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        try {
            hotelSchema.parse(formData)
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
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre del hotel"
                    className={errors.nombre ? "border-red-500" : ""}
                />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Dirección del hotel"
                    className={errors.direccion ? "border-red-500" : ""}
                />
                {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Ciudad del hotel"
                    className={errors.ciudad ? "border-red-500" : ""}
                />
                {errors.ciudad && <p className="text-red-500 text-sm">{errors.ciudad}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="nit">NIT</Label>
                <Input
                    id="nit"
                    name="nit"
                    value={formData.nit}
                    onChange={handleChange}
                    placeholder="NIT del hotel"
                    className={errors.nit ? "border-red-500" : ""}
                />
                {errors.nit && <p className="text-red-500 text-sm">{errors.nit}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="numero_habitaciones">Número de Habitaciones</Label>
                <Input
                    id="numero_habitaciones"
                    name="numero_habitaciones"
                    type="number"
                    value={formData.numero_habitaciones}
                    onChange={handleChange}
                    placeholder="Número de habitaciones"
                    min="0"
                    className={errors.numero_habitaciones ? "border-red-500" : ""}
                />
                {errors.numero_habitaciones && <p className="text-red-500 text-sm">{errors.numero_habitaciones}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : initialData ? "Actualizar Hotel" : "Crear Hotel"}
            </Button>
        </form>
    )
}