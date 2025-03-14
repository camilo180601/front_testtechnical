export interface Hotel {
    id: number
    nombre: string
    direccion: string
    ciudad: string
    nit: string
    numero_habitaciones: number
    habitaciones?: Habitacion[]
}

export interface Habitacion {
    id: number
    hotel_id: number
    tipo: string
    cantidad: number
    acomodaciones?: Acomodacion[]
}

export interface Acomodacion {
    id: number
    habitacion_id: number
    tipo: string
}

export type TipoHabitacion = "ESTANDAR" | "JUNIOR" | "SUITE"
export type TipoAcomodacion = "SENCILLA" | "DOBLE" | "TRIPLE" | "CUADRUPLE"