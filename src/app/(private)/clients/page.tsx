import { getCalendarEventTimes } from "@/server/actions/googleCalendar"
import { auth } from "@clerk/nextjs/server"
// import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatInTimeZone } from 'date-fns-tz'
import { Clock, User, Pencil, Phone } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { calendar_v3 } from "googleapis"

interface CalendarEvent {
  start: Date
  end: Date
  summary?: string | null
  description?: string | null
  attendees?: calendar_v3.Schema$EventAttendee[]
}

const displayTimezone = "America/Cordoba"

export default async function ClientsPage() {
  const { userId } = await auth()

  if (userId == null) return null

  const today = new Date()
  const startOfCurrentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  const events = await getCalendarEventTimes(userId, {
    start: startOfCurrentDay,
    end: endOfNextMonth,
  })

  // Extraer clientes únicos y agrupar sus eventos
  const clientsMap = new Map<string, CalendarEvent[]>()
  events.forEach(event => {
    const clientName = event.summary?.split(" + ")[0] || "Cliente"
    if (!clientsMap.has(clientName)) {
      clientsMap.set(clientName, [])
    }
    clientsMap.get(clientName)!.push(event)
  })
  const clients = Array.from(clientsMap.entries())

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Clientes
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Aquí puedes ver todos tus clientes y su historial de turnos
          </p>
        </div>

        <div className="grid gap-6">
          {clients.length === 0 && (
            <p className="text-gray-500">No hay clientes con turnos registrados.</p>
          )}
          {clients.map(([clientName, clientEvents]) => (
            <ClientCard key={clientName} clientName={clientName} events={clientEvents} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ClientCard({
  clientName,
  events,
}: {
  clientName: string
  events: CalendarEvent[]
}) {
  // Ordenar eventos por fecha descendente
  const sortedEvents = [...events].sort((a, b) => b.start.getTime() - a.start.getTime())

  return (
    <Card className="max-w-3xl hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <User className="size-5 text-gray-500" />
            <div>
              <CardTitle className="text-lg font-medium">{clientName}</CardTitle>
              <CardDescription>
                {events.length} turno{events.length > 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="size-4 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="size-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedEvents.map((event, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-700 border-b pb-2 last:border-b-0 last:pb-0">
              <Clock className="size-4 text-gray-400" />
              <span>
                {formatInTimeZone(event.start, displayTimezone, "d MMMM yyyy, HH:mm", { locale: es })} - {formatInTimeZone(event.end, displayTimezone, "HH:mm", { locale: es })}
              </span>
              {event.description && (
                <span className="ml-2 text-xs text-gray-500">({event.description})</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}