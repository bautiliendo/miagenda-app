"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventFormSchema } from "@/schema/events"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import Link from "next/link"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "../ui/alert-dialog"
import { useTransition } from "react"

export function EventForm({
    event,
}: {
    event?: {
        id: string
        name: string
        description?: string
        durationInMinutes: number
        isActive: boolean
    }
}) {
    const [isDeletePending, startDeleteTransition] = useTransition()

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event ?? {
            name: "", // Agregar un valor predeterminado explícito
            isActive: true,
            durationInMinutes: 30,
            description: "", // Agregar un valor predeterminado explícito
        },
    });

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const action =
            event == null ? createEvent : updateEvent.bind(null, event.id)
        const data = await action(values)

        if (data?.error) {
            form.setError("root", {
                message: "Hubo un error al guardar su evento",
            })
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col"
            >
                {form.formState.errors.root && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}

                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                                <FormLabel className="text-gray-700">Nombre del Servicio</FormLabel>
                                <FormControl>
                                    <Input className="bg-white border-gray-200" {...field} />
                                </FormControl>
                                <FormDescription className="text-gray-600">
                                    El nombre que los usuarios verán al reservar
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="durationInMinutes"
                        render={({ field }) => (
                            <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                                <FormLabel className="text-gray-700">Duración</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        className="bg-white border-gray-200 w-32" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormDescription className="text-gray-600">
                                    Duración del servicio en minutos
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                                <FormLabel className="text-gray-700">Descripción</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        className="resize-none h-32 bg-white border-gray-200" 
                                        placeholder="Describe los detalles del servicio..."
                                        {...field} 
                                    />
                                </FormControl>
                                <FormDescription className="text-gray-600">
                                    Añade una descripción detallada de tu servicio
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-gray-700 !mt-0">Servicio Activo</FormLabel>
                                </div>
                                <FormDescription className="text-gray-600 mt-2">
                                    Los servicios inactivos no estarán disponibles para reservas
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                    {event && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructiveGhost"
                                    className="hover:bg-red-50"
                                    disabled={isDeletePending || form.formState.isSubmitting}
                                >
                                    Eliminar Servicio
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción eliminará permanentemente este servicio y no se puede deshacer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={isDeletePending || form.formState.isSubmitting}
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => {
                                            startDeleteTransition(async () => {
                                                const data = await deleteEvent(event.id)
                                                if (data?.error) {
                                                    form.setError("root", {
                                                        message: "Error al eliminar el servicio"
                                                    })
                                                }
                                            })
                                        }}
                                    >
                                        Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <Button
                        type="button"
                        asChild
                        variant="outline"
                        className="border-gray-200 hover:bg-gray-50"
                        disabled={isDeletePending || form.formState.isSubmitting}
                    >
                        <Link href="/events">Cancelar</Link>
                    </Button>
                    <Button
                        disabled={isDeletePending || form.formState.isSubmitting}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
                    >
                        {form.formState.isSubmitting ? "Guardando..." : "Guardar Servicio"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}