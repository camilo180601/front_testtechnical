"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HotelForm } from "@/components/hotel-form"
import { fetchHotel, updateHotel } from "@/lib/api"
import type { Hotel } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { use } from "react"

// Update the interface to match Next.js 15 requirements
interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default function EditarHotelPage({ params }: PageProps) {
  const resolvedParams = use(params) // Unwrap the params Promise
  const router = useRouter()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getHotel = async () => {
      try {
        setLoading(true)
        const data = await fetchHotel(Number.parseInt(resolvedParams.id))
        setHotel(data)
        setError(null)
      } catch (err) {
        setError("Error al cargar los datos del hotel. Intente nuevamente.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getHotel()
  }, [resolvedParams.id])

  const handleSubmit = async (data: Omit<Hotel, "id">) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await updateHotel(Number.parseInt(resolvedParams.id), data)
      router.push(`/hoteles/${resolvedParams.id}`)
    } catch (err) {
      console.error(err)
      setError("Error al actualizar el hotel. Por favor, intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href={`/hoteles/${resolvedParams.id}`} className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Volver a detalles</span>
          </Link>
        </div>

        <div className="mb-8">
          <Skeleton className="h-10 w-1/3" />
        </div>

        <div className="max-w-2xl">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
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
        <Link href={`/hoteles/${resolvedParams.id}`} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Volver a detalles</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Hotel</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="max-w-2xl">
        <HotelForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={hotel} />
      </div>
    </div>
  )
}