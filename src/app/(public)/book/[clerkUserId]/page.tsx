import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { formatEventDescription } from "@/lib/formatters"
import { clerkClient } from "@clerk/nextjs/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, CalendarPlus, CalendarCheck, Star, MapPin, Phone, Mail, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const revalidate = 0

export default async function BookingPage({
  params,
}: {
  params: { clerkUserId: string }
}) {
  const { clerkUserId } = await params;

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

  if (events.length === 0) return notFound()

  const { fullName, primaryEmailAddress, primaryPhoneNumber } = await (await clerkClient()).users.getUser(clerkUserId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo Section */}
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
                AgendIA
              </span>
            </div>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="size-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-600">Profesional Verificado</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {fullName}
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-4">
              Selecciona el servicio que deseas reservar y encontremos el mejor horario para tu cita.
            </p>
            <div className="flex items-center justify-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
                <CalendarCheck className="size-5" />
                <span className="text-sm">Reserva online 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-5" />
                <span className="text-sm">Ubicación</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="size-5" />
              <span>{primaryPhoneNumber?.phoneNumber || 'No disponible'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="size-5" />
              <span>{primaryEmailAddress?.emailAddress || 'No disponible'}</span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cómo funciona el sistema de reservas?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Selecciona el servicio que deseas, elige una fecha y hora disponible, y confirma tu reserva. Recibirás un correo electrónico con los detalles de tu cita.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Puedo cancelar o reprogramar mi cita?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sí, puedes cancelar o reprogramar tu cita hasta 24 horas antes de la fecha programada a través del enlace en tu correo de confirmación.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

type EventCardProps = {
  id: string
  price: number
  name: string
  clerkUserId: string
  description: string | null
  durationInMinutes: number
}

function EventCard({
  id,
  name,
  price,
  description,
  clerkUserId,
  durationInMinutes,
}: EventCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:border-blue-200 border-gray-200">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-900">{name}</CardTitle>
          <Badge variant="secondary" className="bg-blue-50 text-blue-600">
            {formatEventDescription(durationInMinutes)}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 mt-2 font-bold text-black">
          <DollarSign className="size-4" />
          <span>{price > 0 ? `${price.toLocaleString('es-ES')}` : ''}</span>
        </CardDescription><CardDescription className="flex items-center gap-2 text-gray-600 mt-2">
          <Clock className="size-4" />
          <span>Reserva instantánea</span>
        </CardDescription>
      </CardHeader>
      {description != null && (
        <CardContent className="py-4 flex-grow">
          <p className="text-gray-700">{description}</p>
        </CardContent>
      )}
      <CardFooter className="pt-4 border-t bg-gray-50/50">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all"
        >
          <Link href={`/book/${clerkUserId}/${id}`}>
            <CalendarPlus className="size-4 mr-2" />
            Reservar Ahora
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}