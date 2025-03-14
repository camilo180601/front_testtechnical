"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Hotel } from "@/lib/types"
import { fetchHotel, deleteHotel } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Hash, Bed, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { Skeleton } from "@/components/ui/skeleton"
import { HabitacionesList } from "@/components/habitaciones-list"
import { use } from "react"

// Update the interface to make searchParams a Promise as well
interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default function HotelDetailPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params) // Unwrap the params Promise
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const getHotel = async () => {
      try {
        setLoading(true)
        const data = await fetchHotel(Number.parseInt(resolvedParams.id))
        setHotel(data)
        setError(null)
      } catch (err) {
        setError("Error al cargar los detalles del hotel. Intente nuevamente.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getHotel()
  }, [resolvedParams.id])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteHotel(Number.parseInt(resolvedParams.id))
      router.push("/")
    } catch (error) {
      console.error("Error al eliminar el hotel:", error)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Volver a la lista</span>
          </Link>
        </div>

        <div className="mb-6">
          <Skeleton className="h-10 w-1/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Volver a la lista</span>
          </Link>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "No se encontró el hotel solicitado"}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Volver a la lista</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{hotel.nombre}</h1>
        <div className="flex space-x-2">
          <Link href={`/habitaciones/nueva?hotel_id=${hotel.id}`}>
            <Button variant="outline" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              <span>Añadir Habitación</span>
            </Button>
          </Link>
          <Link href={`/hoteles/editar/${hotel.id}`}>
            <Button variant="outline">Editar</Button>
          </Link>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <Building2 className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{hotel.nombre}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-medium">{hotel.direccion}</p>
                <p className="text-sm font-medium text-gray-700">{hotel.ciudad}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Hash className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">NIT</p>
                <p className="font-medium">{hotel.nit}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Bed className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Número de Habitaciones</p>
                <p className="font-medium">{hotel.numero_habitaciones}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Habitaciones y Acomodaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <HabitacionesList habitaciones={hotel.habitaciones || []} hotelId={hotel.id} />
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Hotel"
        description={`¿Estás seguro que deseas eliminar el hotel "${hotel.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}