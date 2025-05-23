'use client'

import { formatInTimeZone } from "date-fns-tz"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { es } from "date-fns/locale"
import { Clock, User, Loader2, Mail, Briefcase, Phone } from "lucide-react"
import { Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { calendar_v3 } from "googleapis"
import { deleteCalendarEvent } from "@/server/actions/googleCalendar"
import { useTransition, useState } from "react"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "./ui/alert-dialog"
import { toast } from "sonner"

interface CalendarEvent {
    id: string
    start: Date
    end: Date
    summary?: string | null
    description?: string | null
    attendees?: calendar_v3.Schema$EventAttendee[]
    extendedProperties?: {
        private?: {
            guestPhone?: string | null
        }
    }
}


const displayTimezone = "America/Cordoba";

export function EventCard({ event }: { event: CalendarEvent }) {
    const [isDeletePending, startDeleteTransition] = useTransition()
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const clientName = event.summary?.split(" + ")[0] || "Cliente"
    const serviceNamePart = event.summary?.split(": ")[1];
    const serviceName = serviceNamePart || "Servicio no especificado";
    const dayFormatted = formatInTimeZone(event.start, displayTimezone, "d", { locale: es })
    const monthFormatted = formatInTimeZone(event.start, displayTimezone, "MMMM", { locale: es })
    const dayOfWeekFormatted = formatInTimeZone(event.start, displayTimezone, "EEEE", { locale: es })
    const guestPhone = event.extendedProperties?.private?.guestPhone || "Teléfono no especificado";
    const guestEmail = event.attendees?.[1]?.email || "Correo no especificado";

    const handleDeleteConfirm = () => {
        startDeleteTransition(async () => {
            try {
                const result = await deleteCalendarEvent(event.id);
                if (result.success) {
                    toast.success("Evento eliminado correctamente.");
                    setIsDialogOpen(false);
                } else {
                    toast.error(result.error || "Error al eliminar el evento.");
                }
            } catch (error) {
                console.error("Error deleting calendar event:", error);
                toast.error("Ocurrió un error inesperado al eliminar el evento.");
            }
        });
    };

    return (
        <Card className="max-w-3xl hover:shadow-md transition-shadow">
            <CardHeader className="">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 rounded-md p-2 min-w-14 h-14 sm:min-w-16 sm:h-16">
                            <span className="text-xl font-bold sm:text-2xl">{dayFormatted}</span>
                            <span className="text-xs capitalize sm:text-sm">{monthFormatted.substring(0, 3)}</span>
                        </div>
                        <div>
                            <CardTitle className="text-base sm:text-lg capitalize">
                                {dayOfWeekFormatted}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Clock className="size-3.5 text-gray-500" />
                                <span>
                                    {formatInTimeZone(event.start, displayTimezone, "HH:mm", { locale: es })} - {formatInTimeZone(event.end, displayTimezone, "HH:mm", { locale: es })}
                                </span>
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"
                                    disabled={isDeletePending}
                                    className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-100 dark:hover:bg-red-800/30">
                                    {isDeletePending ? (
                                        <Loader2 className="size-4 text-red-500 animate-spin" />
                                    ) : (
                                        <Trash2 className="size-4 text-red-500" />
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción eliminará permanentemente el evento de tu Google Calendar. No se puede deshacer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeletePending}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={isDeletePending}
                                        onClick={handleDeleteConfirm}
                                    >
                                        {isDeletePending ? (
                                            <>
                                                <Loader2 className="mr-2 size-4 animate-spin" />
                                                Eliminando...
                                            </>
                                        ) : (
                                            "Sí, eliminar evento"
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Briefcase className="size-4 text-gray-500" />
                    <span className="font-medium">{serviceName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <User className="size-4 text-gray-500" />
                    <span className="font-medium">{clientName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Phone className="size-4 text-gray-500" />
                    <span className="font-medium">{guestPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Mail className="size-4 text-gray-500" />
                    <span className="font-medium">{guestEmail}</span>
                </div>

                {event.description && (
                    <p className="text-gray-600 text-sm mt-2 border-t pt-2">{event.description}</p>
                )}
            </CardContent>
        </Card>
    )
}