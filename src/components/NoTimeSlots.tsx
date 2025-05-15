import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";


export function NoTimeSlots({
    event,
    calendarUser,
  }: {
    event: { name: string; description: string | null }
    calendarUser: { id: string; fullName: string | null }
  }) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-2xl text-gray-900">
                No hay horarios disponibles
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                <div className="font-medium text-blue-600">{event.name}</div>
                {event.description && (
                  <div className="mt-1">{event.description}</div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 text-gray-600">
              <p>{calendarUser.fullName} tiene su agenda completa en este momento. Por favor, intentá más tarde o elegí otro servicio.</p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50/50">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
              >
                <Link href={`/book/${calendarUser.id}`}>Ver otros servicios disponibles</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }