import { getCalendarEventTimes } from "@/server/googleCalendar"
import { auth } from "@clerk/nextjs/server"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, User, ChevronDown, Pencil, Trash2, Phone } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { calendar_v3 } from "googleapis"

interface CalendarEvent {
  start: Date
  end: Date
  summary?: string | null
  description?: string | null
  attendees?: calendar_v3.Schema$EventAttendee[]
}

export default async function AgendaPage() {
  const { userId } = await auth()

  if (userId == null) return null

  const today = new Date()
  const startOfCurrentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  const events = await getCalendarEventTimes(userId, {
    start: startOfCurrentDay,
    end: endOfNextMonth,
  })

  // Ordenar eventos por fecha de inicio
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  // Agrupar eventos por mes
  const eventsByMonth = sortedEvents.reduce((acc, event) => {
    const monthKey = format(event.start, "MMMM yyyy", { locale: es })
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(event)
    return acc
  }, {} as Record<string, typeof events>)

  // Determinar si un mes es el mes actual
  const isCurrentMonth = (monthKey: string) => {
    const currentMonthKey = format(today, "MMMM yyyy", { locale: es })
    return monthKey === currentMonthKey
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Agenda
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Aquí puedes ver todas tus citas programadas
          </p>
        </div>
        <div className="grid gap-6">
          {events.length === 0 && (
            <p className="text-gray-500">No hay turnos programados.</p>
          )}
          {events.map((event) => (
            <EventCard key={event.start.getTime()} event={event} />
          ))}
        </div>

        <div className="grid gap-6">
          {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
            <div key={month} className="space-y-4">
              {isCurrentMonth(month) ? (
                <Collapsible defaultOpen={true}>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full text-xl font-semibold text-gray-800 capitalize hover:text-gray-900">
                    <ChevronDown className="size-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    {month}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-4 mt-4">
                      {monthEvents.map((event, index) => (
                        <EventCard key={index} event={event} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full text-xl font-semibold text-gray-800 capitalize hover:text-gray-900">
                    <ChevronDown className="size-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    {month}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-4 mt-4">
                      {monthEvents.map((event, index) => (
                        <EventCard key={index} event={event} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }: { event: CalendarEvent }) {
  const clientName = event.summary?.split(" + ")[0] || "Cliente"
  const dayFormatted = format(event.start, "d", { locale: es })
  const monthFormatted = format(event.start, "MMMM", { locale: es })
  const dayOfWeekFormatted = format(event.start, "EEEE", { locale: es })

  return (
    <Card className="max-w-3xl hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 rounded-md p-2 min-w-14 h-14 sm:min-w-16 sm:h-16">
              <span className="text-xl font-bold sm:text-2xl">{dayFormatted}</span>
              <span className="text-xs capitalize sm:text-sm">{monthFormatted.substring(0, 3)}</span>
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg capitalize">
                {dayOfWeekFormatted}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Clock className="size-3.5 text-gray-500" />
                <span>{format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <Phone className="size-4 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <Pencil className="size-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <User className="size-4 text-gray-500" />
          <span className="font-medium">{clientName}</span>
        </div>
        {event.description && (
          <p className="text-gray-600 text-sm mt-2 border-t pt-2">{event.description}</p>
        )}
      </CardContent>
    </Card>
  )
}