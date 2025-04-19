import { EventForm } from "@/components/forms/EventForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";

export default async function SchedulePage() {

    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn()

    const schedule = await db.query.ScheduleTable.findFirst


    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Cronograma de eventos</CardTitle>
            </CardHeader>
            <CardContent>
                <EventForm />
            </CardContent>
        </Card>
    )
}
