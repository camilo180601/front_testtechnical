import type { Hotel, Habitacion, Acomodacion } from "./types"

const API_BASE_URL = "https://back-testtechnical-main-y71e7j.laravel.cloud/api"

// Hoteles
export async function fetchHoteles(): Promise<Hotel[]> {
  const response = await fetch(`${API_BASE_URL}/hoteles`)

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return response.json()
}

// Actualiza la función fetchHotel para incluir habitaciones y acomodaciones
export async function fetchHotel(id: number): Promise<Hotel> {
  const response = await fetch(`${API_BASE_URL}/hoteles/${id}?include=habitaciones.acomodaciones`)

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return response.json()
}

export async function createHotel(hotel: Omit<Hotel, "id">): Promise<Hotel> {
  const response = await fetch(`${API_BASE_URL}/hoteles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hotel),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return response.json()
}

export async function updateHotel(id: number, hotel: Omit<Hotel, "id">): Promise<Hotel> {
  const response = await fetch(`${API_BASE_URL}/hoteles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hotel),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return response.json()
}

export async function deleteHotel(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/hoteles/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
}

// Habitaciones
// Actualiza la función fetchHabitaciones para incluir acomodaciones
export async function fetchHabitaciones(): Promise<Habitacion[]> {
  const response = await fetch(`${API_BASE_URL}/habitaciones?include=acomodaciones`)

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return response.json()
}

export async function createHabitacion(habitacion: Omit<Habitacion, "id">): Promise<Habitacion> {
  const response = await fetch(`${API_BASE_URL}/habitaciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(habitacion),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return response.json()
}

// Acomodaciones
export async function createAcomodacion(acomodacion: Omit<Acomodacion, "id">): Promise<Acomodacion> {
  const response = await fetch(`${API_BASE_URL}/acomodaciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(acomodacion),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  return response.json()
}