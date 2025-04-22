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
import { Clock, CalendarPlus } from "lucide-react"

export const revalidate = 0

export default async function BookingPage({
  params: { clerkUserId },
}: {
  params: { clerkUserId: string }
}) {
  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

  if (events.length === 0) return notFound()

  const { fullName } = await (await clerkClient()).users.getUser(clerkUserId)

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {fullName}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona el servicio que deseas reservar y encontremos el mejor horario para tu cita.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  )
}

type EventCardProps = {
  id: string
  name: string
  clerkUserId: string
  description: string | null
  durationInMinutes: number
}

function EventCard({
  id,
  name,
  description,
  clerkUserId,
  durationInMinutes,
}: EventCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-lg border-gray-200">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="text-xl text-gray-900">{name}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-gray-600 mt-2">
          <Clock className="size-4" />
          {formatEventDescription(durationInMinutes)}
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
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