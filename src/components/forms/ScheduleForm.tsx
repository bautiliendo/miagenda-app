"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "../ui/form"
import { Button } from "../ui/button"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { scheduleFormSchema } from "@/schema/schedule"
import { timeToInt } from "@/lib/utils"
import {
} from "../ui/select"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { saveSchedule } from "@/server/actions/schedule"

type Availability = {
    startTime: string
    endTime: string
    dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
}

export function ScheduleForm({
    schedule,
}: {
    schedule?: {
        timezone: string
        availabilities: Availability[]
    }
}) {
    const [successMessage, setSuccessMessage] = useState<string>()
    const form = useForm<z.infer<typeof scheduleFormSchema>>({
        resolver: zodResolver(scheduleFormSchema),
        defaultValues: {
            timezone: "America/Cordoba",
            availabilities: schedule?.availabilities.toSorted((a, b) => {
                return timeToInt(a.startTime) - timeToInt(b.startTime)
            }),
        },
    })

    const {
        append: addAvailability,
        remove: removeAvailability,
        fields: availabilityFields,
    } = useFieldArray({ name: "availabilities", control: form.control })

    const groupedAvailabilityFields = availabilityFields
        .map((field, index) => ({ ...field, originalIndex: index }))
        .reduce((acc, availability) => {
            if (!acc[availability.dayOfWeek]) {
                acc[availability.dayOfWeek] = [];
            }
            acc[availability.dayOfWeek].push(availability);
            return acc;
        }, {} as Record<string, (typeof availabilityFields[number] & { originalIndex: number })[]>);

    async function onSubmit(values: z.infer<typeof scheduleFormSchema>) {
        const data = await saveSchedule(values)

        if (data?.error) {
            form.setError("root", {
                message: "Ocurrió un error al guardar el cronograma",
            })
        } else {
            setSuccessMessage("Cronograma guardado correctamente!")
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
                {form.formState.errors.availabilities && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        Hay horarios superpuestos. Por favor, corrige los horarios que se superponen.
                    </div>
                )}
                {successMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
                        <div className="size-2 rounded-full bg-green-500" />
                        {successMessage}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="bg-gray-50/50 p-4 rounded-lg border">
                        <div className="text-gray-700 font-medium">Zona Horaria</div>
                        <div className="text-gray-600 mt-1">
                            Argentina (GMT-3)
                        </div>
                    </div>

                    <div className="space-y-4">
                        {DAYS_OF_WEEK_IN_ORDER.map(dayOfWeek => (
                            <div 
                                key={dayOfWeek} 
                                className="bg-white border rounded-lg overflow-hidden"
                            >
                                <div className="flex flex-col p-3 border-b bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-medium text-gray-800 capitalize">
                                            {dayOfWeek}
                                        </h3>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                addAvailability({
                                                    dayOfWeek,
                                                    startTime: "09:00",
                                                    endTime: "17:00",
                                                })
                                            }}
                                            className="h-8 px-3 text-sm text-blue-600 border-blue-200 hover:bg-blue-50"
                                        >
                                            <Plus className="size-3.5 mr-1.5" />
                                            Agregar
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-3 space-y-2">
                                    {groupedAvailabilityFields[dayOfWeek]?.length === 0 && (
                                        <div className="text-sm text-gray-500 italic text-center py-2">
                                            No hay horarios disponibles
                                        </div>
                                    )}
                                    {groupedAvailabilityFields[dayOfWeek]?.map(
                                        (field, labelIndex) => (
                                            <div
                                                key={field.id}
                                                className="flex flex-col bg-gray-50 rounded-md overflow-hidden"
                                            >
                                                <div className="flex items-center p-2 gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`availabilities.${field.originalIndex}.startTime`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input
                                                                        className="h-9 text-center text-sm"
                                                                        placeholder="Inicio"
                                                                        aria-label={`${dayOfWeek} Hora inicio ${labelIndex + 1}`}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <span className="text-gray-500 text-sm">-</span>
                                                    <FormField
                                                        control={form.control}
                                                        name={`availabilities.${field.originalIndex}.endTime`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input
                                                                        className="h-9 text-center text-sm"
                                                                        placeholder="Fin"
                                                                        aria-label={`${dayOfWeek} Hora fin ${labelIndex + 1}`}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => removeAvailability(field.originalIndex)}
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                </div>
                                                {form.formState.errors.availabilities?.[field.originalIndex]?.message && (
                                                    <div className="px-2 pb-2">
                                                        <div className="text-red-500 text-xs">
                                                            {form.formState.errors.availabilities?.[field.originalIndex]?.message}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
                    >
                        {form.formState.isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}