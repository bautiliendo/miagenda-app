import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { formatDateTime } from "@/lib/formatters"
import { clerkClient } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { CheckCircle } from "lucide-react"
import Footer from "@/components/footer"

export const revalidate = 0

interface PageProps {
    params: Promise<{
        clerkUserId: string
        eventId: string
    }>
    searchParams: Promise<{
        startTime: string
    }>
}

export default async function SuccessPage({ params, searchParams }: PageProps) {
    const { clerkUserId, eventId } = await params
    const { startTime } = await searchParams

    const event = await db.query.EventTable.findFirst({
        where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
            and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
    })

    if (event == null) notFound()

    const calendarUser = await (await clerkClient()).users.getUser(clerkUserId)
    const startTimeDate = new Date(startTime)

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 ">
            <div className="flex mx-auto w-full max-w-xl items-center justify-center">
                <Card className="shadow-lg border-gray-200 w-full">
                    <CardHeader className="border-b bg-gray-50/50 text-center">
                        <div className="mx-auto size-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="size-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl text-gray-900">
                            ¡Reserva Confirmada!
                        </CardTitle>
                        <CardDescription className="mt-2">
                            <div className="font-medium text-blue-600">{event.name}</div>
                            <div className="mt-1">con {calendarUser.fullName}</div>
                            <div className="mt-2 text-gray-600">{formatDateTime(startTimeDate)}</div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="py-6 text-center text-gray-600">
                        <p>Recibirás un email de confirmación en breve.</p>
                        <p className="mt-2">¡Ya puedes cerrar esta página!</p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-auto pt-6">
                <Footer />
            </div>
        </div>
    )
}