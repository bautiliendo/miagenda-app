import { ScheduleForm } from "@/components/forms/ScheduleForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { Clock } from "lucide-react";

export const revalidate = 0

export default async function SchedulePage() {
    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn()

    const schedule = await db.query.ScheduleTable.findFirst({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        with: { availabilities: true },
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                        <Clock className="size-8 text-blue-600" />
                        Mi Disponibilidad
                    </h1>
                    <p className="mt-2 text-gray-600 text-lg">
                        Configura tus horarios de atención para cada día de la semana
                    </p>
                </div>

                <Card className="shadow-lg border-gray-200">
                    <CardHeader className="border-b bg-gray-50/50">
                        <CardTitle className="text-xl text-gray-800">Horarios de Atención</CardTitle>
                        <CardDescription>
                            Define los intervalos de tiempo en los que atiendes a tus clientes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ScheduleForm schedule={schedule} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
