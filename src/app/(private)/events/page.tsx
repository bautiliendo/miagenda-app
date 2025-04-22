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
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
                            Catálogo de Servicios
                        </h1>
                        <p className="mt-2 text-gray-600 text-lg">
                            Gestiona los servicios que ofreces a tus clientes
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="default"
                        className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
                    >
                        <Link href='/events/new'>
                            <CalendarPlus className="mr-2 size-5" />
                            <span>Añadir Nuevo Servicio</span>
                        </Link>
                    </Button>
                </div>

                {events.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                        {events.map(event => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                        <CalendarRange className="size-16 mx-auto text-blue-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Sin servicios configurados
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Comienza añadiendo tu primer servicio para que tus clientes puedan realizar reservas.
                        </p>
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
                            asChild
                        >
                            <Link href="/events/new">
                                <CalendarPlus className="mr-2 size-5" />
                                <span>Crear Primer Servicio</span>
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
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
        <Card className={cn(
            "flex flex-col h-full transition-all duration-200 hover:shadow-lg",
            !isActive && "opacity-75 bg-gray-50"
        )}>
            <CardHeader className={cn(!isActive && "opacity-50")}>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-gray-900">{name}</CardTitle>
                    {isActive && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Activo
                        </span>
                    )}
                </div>
                <CardDescription className="text-gray-600 flex items-center mt-2">
                    <CalendarRange className="size-4 mr-2" />
                    {formatEventDescription(durationInMinutes)}
                </CardDescription>
            </CardHeader>
            {description != null && (
                <CardContent className={cn("flex-grow", !isActive && "opacity-50")}>
                    <p className="text-gray-700 line-clamp-3">{description}</p>
                </CardContent>
            )}
            <CardFooter className="flex flex-wrap justify-end gap-2 pt-4 border-t mt-auto">
                {isActive && (
                    <CopyEventButton
                        variant="outline"
                        eventId={id}
                        clerkUserId={clerkUserId}
                        className="w-full sm:w-auto"
                    />
                )}
                <Button asChild variant="default" className="w-full sm:w-auto">
                    <Link href={`/events/${id}/edit`}>
                        Editar Servicio
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}