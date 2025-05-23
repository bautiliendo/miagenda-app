import { getCalendarEventTimes, getOAuthClient } from "@/server/actions/googleCalendar"
import { auth } from "@clerk/nextjs/server"
import { es } from "date-fns/locale"
import { CalendarPlus, ChevronDown, AlertTriangle } from "lucide-react"
import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { formatInTimeZone } from "date-fns-tz"
import { EventCard } from "@/components/EventCard"
import { Button } from "@/components/ui/button"
import { db } from "@/drizzle/db"
import { UserButton } from "@clerk/nextjs"

const displayTimezone = "America/Cordoba";

export default async function AgendaPage() {
  const { userId } = await auth()
  if (userId == null) return null
  const client = await getOAuthClient(userId)

  if (!client) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg shadow-md">
          <AlertTriangle className="mx-auto h-12 w-12 text-orange-400 mb-4" />
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">
            Conexión con Google Calendar Requerida
          </h2>
          <p className="text-orange-600 mb-6">
            Para acceder a tu agenda y gestionar tus citas, es necesario que conectes tu cuenta de Google.
          </p>
          <UserButton showName={true}/>
          <p className="text-sm text-gray-500 mt-4">
            Haz click en el botón de tu cuenta, presiona &quot;Manage account&quot; y conecta tu cuenta de Google Calendar en &quot;Connected accounts&quot;.
          </p>
        </div>
      </div>
    )
  }

  // Fetch active event types for the user
  const eventTypes = await db.query.EventTable.findMany({
    where: ({ clerkUserId: cId, isActive }, { eq, and }) =>
      and(eq(cId, userId), eq(isActive, true)),
    columns: {
      id: true,
      name: true,
    },
    orderBy: ({ name }, { asc }) => [asc(name)],
  });

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
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Agenda
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Aquí puedes ver todas tus citas programadas
          </p>

          <div className="my-6">
            {eventTypes.length === 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700">
                  No tienes tipos de servicios activos para crear nuevas citas.
                  <br />
                  Puedes gestionarlos en <Link href="/events" className="font-semibold underline hover:text-yellow-800">configuración de servicios</Link>.
                </p>
              </div>
            )}
            {eventTypes.length >= 1 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-blue-800">Crear Nueva Cita:</h2>
                <p className="mb-3 text-blue-700">Selecciona el tipo de evento para el cual deseas añadir una nueva cita:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {eventTypes.map(eventType => (
                    <Button key={eventType.id} variant="outline" className="w-full justify-start text-left h-auto py-3 bg-white hover:bg-gray-50 border-gray-300" asChild>
                      <Link href={`/agenda/new-meeting?eventId=${eventType.id}`}>
                        <CalendarPlus className="mr-3 size-5 flex-shrink-0" />
                        <span className="flex-grow">{eventType.name}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                      {monthEvents.map((event, index) => {
                        const eventForCard = {
                          ...event,
                          extendedProperties: {
                            private: {
                              guestPhone: event.extendedProperties?.private?.guestPhone || null,
                            },
                          },
                        };
                        return <EventCard key={index} event={eventForCard} />;
                      })}
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
                      {monthEvents.map((event, index) => {
                        const eventForCard = {
                          ...event,
                          extendedProperties: {
                            private: {
                              guestPhone: event.extendedProperties?.private?.guestPhone || null,
                            },
                          },
                        };
                        return <EventCard key={index} event={eventForCard} />;
                      })}
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