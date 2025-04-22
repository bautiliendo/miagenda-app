import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import { formatEventDescription } from "@/lib/formatters";
import Link from "next/link";
import { CopyEventButton } from "@/components/CopyEventButton";


export const revalidate = 0

export default async function Eventspage() {
    const { userId } = await auth.protect();

    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    });


    return (
        <div className="p-4">
            <div className="flex gap-4 items-baseline max-w-6xl mx-auto">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">
                    Servicios
                </h1>

                {events.length > 0 ? (
                    <Button
                        asChild
                        variant="outline"
                        className="ml-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm md:text-base lg:text-lg"
                    >
                        <Link href='/events/new'>
                            <CalendarPlus className="mr-2 size-4 md:size-5 lg:size-6" />
                            <span className="hidden sm:inline">Nuevo Servicio</span>
                            <span className="sm:hidden">Nuevo</span>
                        </Link>
                    </Button>
                ) : ''}
            </div>
            {events.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))] max-w-6xl mx-auto">
                    {events.map(event => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <CalendarRange className="size-16 mx-auto" />
                    No se encontro ningun servicio. Crea el primero para empezar !
                    <Button
                        size="sm"
                        className="ml-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm md:text-base lg:text-lg"
                        variant="outline"
                        asChild
                    >
                        <Link href="/events/new">
                            <CalendarPlus className="mr-2 size-4 md:size-5 lg:size-6" />
                            <span className="hidden sm:inline">Nuevo Servicio</span>
                            <span className="sm:hidden">Nuevo</span>
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}


type EventCardProps = {
    id: string
    isActive: boolean
    name: string
    description: string | null
    durationInMinutes: number
    clerkUserId: string
}

function EventCard({
    id,
    isActive,
    name,
    description,
    durationInMinutes,
    clerkUserId,
}: EventCardProps) {
    return (
        <Card className={cn("flex flex-col", !isActive && "border-secondary/50")}>
            <CardHeader className={cn(!isActive && "opacity-50")}>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                    {formatEventDescription(durationInMinutes)}
                </CardDescription>
            </CardHeader>
            {description != null && (
                <CardContent className={cn(!isActive && "opacity-50")}>
                    {description}
                </CardContent>
            )}
            <CardFooter className="flex justify-end gap-2 mt-auto">
                {isActive && (
                    <CopyEventButton
                        variant="outline"
                        eventId={id}
                        clerkUserId={clerkUserId}
                    />
                )}
                <Button asChild>
                    <Link href={`/events/${id}/edit`}>Editar</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}