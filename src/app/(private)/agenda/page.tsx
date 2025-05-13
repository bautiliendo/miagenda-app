import { getCalendarEventTimes } from "@/server/actions/googleCalendar"
import { auth } from "@clerk/nextjs/server"
import { es } from "date-fns/locale"
import { ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { formatInTimeZone } from "date-fns-tz"
import { EventCard } from "@/components/EventCard"


const displayTimezone = "America/Cordoba";

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
    const monthKey = formatInTimeZone(event.start, displayTimezone, "MMMM yyyy", { locale: es })
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(event)
    return acc
  }, {} as Record<string, typeof events>)

  // Determinar si un mes es el mes actual
  const isCurrentMonth = (monthKey: string) => {
    const currentMonthKey = formatInTimeZone(today, displayTimezone, "MMMM yyyy", { locale: es })
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
          {Object.entries(eventsByMonth).length === 0 && events.length > 0 && (
            <p className="text-gray-500">Procesando eventos...</p>
          )}
          {Object.entries(eventsByMonth).length === 0 && events.length === 0 && (
            <p className="text-gray-500">No hay turnos programados.</p>
          )}
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