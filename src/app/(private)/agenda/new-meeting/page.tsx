import Footer from "@/components/footer"
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
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule"
import { auth, clerkClient } from "@clerk/nextjs/server"
import {
    addMonths,
    eachMinuteOfInterval,
    endOfDay,
    roundToNearestMinutes,
} from "date-fns"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { NoTimeSlots } from "@/components/NoTimeSlots"
import { MeetingFormSelf } from "@/components/forms/MeetingFormSelf"

export const revalidate = 0

interface PageProps {
    searchParams: Promise<{
        eventId: string;
    }>;
}

export default async function NewMeetingPage({ searchParams }: PageProps) {
    const { userId: loggedInClerkUserId } = await auth();
    const { eventId } = await searchParams;

    if (!loggedInClerkUserId) {
        redirect("/sign-in");
    }

    if (!eventId) {
        console.error("NewMeetingPage: eventId is missing from searchParams.");
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 flex flex-col items-center justify-center text-center">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-gray-800">Seleccionar Tipo de Evento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-6">
                            Para crear una nueva cita, primero necesitas especificar un tipo de evento.
                            Esto se puede hacer añadiendo <code className="bg-gray-100 p-1 rounded text-sm">?eventId=TU_EVENT_ID</code> a la URL.
                        </p>
                        <p className="text-gray-600 mb-6">
                            Idealmente, serías dirigido aquí con un ID de evento ya seleccionado.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/agenda">Volver a la Agenda</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const event = await db.query.EventTable.findFirst({
        where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
            and(eq(isActive, true), eq(userIdCol, loggedInClerkUserId), eq(id, eventId)),
    })

    if (event == null) {
        console.error(`NewMeetingPage: Event not found for clerkUserId: ${loggedInClerkUserId} and eventId: ${eventId}`);
        return notFound();
    }

    const calendarUser = await (await clerkClient()).users.getUser(loggedInClerkUserId)
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
                            <CardDescription className="text-gray-600 mt-2">
                                <div className="font-medium text-blue-600">{event.name}</div>
                                {event.description && (
                                    <div className="mt-2">{event.description}</div>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <MeetingFormSelf
                                validTimes={validTimes}
                                eventId={event.id}
                                clerkUserId={loggedInClerkUserId}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}
