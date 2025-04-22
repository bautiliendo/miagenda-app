import { EventForm } from "@/components/forms/EventForm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function NewEventPage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-2xl text-gray-900">Crear Nuevo Servicio</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Configura los detalles del servicio que ofrecerás a tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <EventForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}