import { HotelList } from "@/components/hotel-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Hoteles</h1>
        <Link href="/hoteles/nuevo">
          <Button>Nuevo Hotel</Button>
        </Link>
      </div>

      <HotelList />
    </div>
  )
}