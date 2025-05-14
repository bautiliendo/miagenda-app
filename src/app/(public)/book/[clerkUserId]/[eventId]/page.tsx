import { MeetingForm } from "@/components/forms/MeetingForm"
import Footer from "@/components/footer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule"
import { clerkClient } from "@clerk/nextjs/server"
import {
  addMonths,
  eachMinuteOfInterval,
  endOfDay,
  roundToNearestMinutes,
} from "date-fns"
import { notFound } from "next/navigation"
import { NoTimeSlots } from "@/components/NoTimeSlots"

export const revalidate = 0

interface PageProps {
  params: Promise<{
    clerkUserId: string
    eventId: string
  }>
}

export default async function BookEventPage({ params }: PageProps) {
  const { clerkUserId, eventId } = await params

  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
      and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
  })

  if (event == null) return notFound()

  const calendarUser = await (await clerkClient()).users.getUser(clerkUserId)
  const startDate = roundToNearestMinutes(new Date(), {
    nearestTo: 15,
    roundingMethod: "ceil",
  })
  const endDate = endOfDay(addMonths(startDate, 2))

  const validTimes = await getValidTimesFromSchedule(
    eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
    event
  )

  if (validTimes.length === 0) {
    return <NoTimeSlots event={event} calendarUser={calendarUser} />
  }

  return (
    <div> 
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="border-b bg-gray-50/50">
              <div className=" items-center gap-2">
                <CardTitle className="text-2xl text-gray-900">
                  Reserva tu cita
                </CardTitle>
                <span className="text-2xl text-gray-900">con </span>
                <span className="text-2xl font-semibold text-blue-600">{calendarUser.fullName}</span>
              </div>
              <CardDescription className="text-gray-600 mt-2">
                <div className="font-medium text-blue-600">{event.name}</div>
                {event.description && (
                  <div className="mt-2">{event.description}</div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <MeetingForm
                validTimes={validTimes}
                eventId={event.id}
                clerkUserId={clerkUserId}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}

