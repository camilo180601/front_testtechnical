"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Acomodacion, Habitacion, TipoAcomodacion } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { fetchHabitaciones } from "@/lib/api"

const tiposAcomodacion: TipoAcomodacion[] = ["SENCILLA", "DOBLE", "TRIPLE", "CUADRUPLE"]

const acomodacionSchema = z.object({
    habitacion_id: z.number().int().positive("La habitación es requerida"),
    tipo: z.enum(["SENCILLA", "DOBLE", "TRIPLE", "CUADRUPLE"], {
        required_error: "El tipo de acomodación es requerido",
    }),
})

type AcomodacionFormData = Omit<Acomodacion, "id">

interface AcomodacionFormProps {
    initialData?: Acomodacion
    onSubmit: (data: AcomodacionFormData) => void
    isSubmitting: boolean
    defaultHabitacionId?: number
}

export function AcomodacionForm({ initialData, onSubmit, isSubmitting, defaultHabitacionId }: AcomodacionFormProps) {
    const [formData, setFormData] = useState<AcomodacionFormData>({
        habitacion_id: initialData?.habitacion_id || defaultHabitacionId || 0,
        tipo: (initialData?.tipo as TipoAcomodacion) || "SENCILLA",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getHabitaciones = async () => {
            try {
                setLoading(true)
                const data = await fetchHabitaciones()
                setHabitaciones(data)
            } catch (err) {
                console.error("Error al cargar habitaciones:", err)
            } finally {
                setLoading(false)
            }
        }

        getHabitaciones()
    }, [])

    useEffect(() => {
        if (defaultHabitacionId) {
            setFormData((prev) => ({
                ...prev,
                habitacion_id: defaultHabitacionId,
            }))
        }
    }, [defaultHabitacionId])

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: name === "habitacion_id" ? Number.parseInt(value) : value,
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
            acomodacionSchema.parse(formData)
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
                <Label htmlFor="habitacion_id">Habitación</Label>
                <Select
                    value={formData.habitacion_id.toString()}
                    onValueChange={(value) => handleSelectChange("habitacion_id", value)}
                    disabled={loading || !!defaultHabitacionId}
                >
                    <SelectTrigger className={errors.habitacion_id ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar habitación" />
                    </SelectTrigger>
                    <SelectContent>
                        {habitaciones.map((habitacion) => (
                            <SelectItem key={habitacion.id} value={habitacion.id.toString()}>
                                {`Habitación ${habitacion.id} - ${habitacion.tipo}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.habitacion_id && <p className="text-red-500 text-sm">{errors.habitacion_id}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Acomodación</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                    <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        {tiposAcomodacion.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                                {tipo}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : initialData ? "Actualizar Acomodación" : "Crear Acomodación"}
            </Button>
        </form>
    )
}