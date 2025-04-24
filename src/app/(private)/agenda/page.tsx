import { getCalendarEventTimes } from "@/server/googleCalendar"
import { auth } from "@clerk/nextjs/server"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, User } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function AgendaPage() {
  const { userId } = await auth()

  if (userId == null) return null

  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const events = await getCalendarEventTimes(userId, {
    start: startOfMonth,
    end: endOfMonth,
  })

  // Ordenar eventos por fecha de inicio
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Agenda</h1>
        <p className="text-gray-600 mt-2">
          Aquí puedes ver todas tus citas programadas
        </p>
      </div>

      <div className="grid gap-4">
        {sortedEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-center">
                No hay citas programadas para este mes
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedEvents.map((event, index) => {
            // Extraer solo el nombre del cliente del summary
            const clientName = event.summary?.split(" + ")[0] || "Cliente"
            
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-5 text-blue-600" />
                    {format(event.start, "EEEE d 'de' MMMM", { locale: es })}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-gray-500" />
                      {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-gray-500" />
                      {clientName}
                    </div>
                  </CardDescription>
                </CardHeader>
                {event.description && (
                  <CardContent>
                    <p className="text-gray-600">{event.description}</p>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}