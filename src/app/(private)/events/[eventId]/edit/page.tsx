import { EventForm } from "@/components/forms/EventForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export const revalidate = 0

export default async function EditEventPage({
  params: { eventId },
}: {
  params: { eventId: string }
}) {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()

  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)),
  })

  if (event == null) return notFound()

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-2xl text-gray-900">Editar Servicio</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Modifica los detalles de tu servicio &quot;{event.name}&quot;
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <EventForm event={{ ...event, description: event.description || undefined }} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}