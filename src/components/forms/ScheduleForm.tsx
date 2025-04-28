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

                <div className="bg-gray-50/50 p-4 rounded-lg border">
                    <div className="text-gray-700 font-medium">Zona Horaria</div>
                    <div className="text-gray-600 mt-1">
                        Argentina (GMT-3)
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {DAYS_OF_WEEK_IN_ORDER.map(dayOfWeek => (
                        <div 
                            key={dayOfWeek} 
                            className="bg-white border rounded-lg overflow-hidden"
                        >
                            <div className="p-5 border-b bg-gray-50/50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-medium text-gray-800 capitalize">
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
                                        className="h-9 px-4 text-sm text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        <Plus className="size-4 mr-2" />
                                        Agregar
                                    </Button>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {groupedAvailabilityFields[dayOfWeek]?.length 
                                        ? `${groupedAvailabilityFields[dayOfWeek]?.length} horario${groupedAvailabilityFields[dayOfWeek]?.length > 1 ? 's' : ''}`
                                        : 'Sin horarios configurados'
                                    }
                                </div>
                            </div>
                            
                            <div className="p-4 space-y-4">
                                {groupedAvailabilityFields[dayOfWeek]?.length === 0 && (
                                    <div className="text-sm text-gray-500 text-center py-6 bg-gray-50/30 rounded-lg border border-dashed">
                                        No hay horarios disponibles
                                    </div>
                                )}
                                {groupedAvailabilityFields[dayOfWeek]?.map(
                                    (field, labelIndex) => (
                                        <div
                                            key={field.id}
                                            className="flex items-center gap-3 p-3 pr-14 bg-gray-50/30 rounded-lg relative group hover:bg-gray-50/70 transition-colors"
                                        >
                                            <FormField
                                                control={form.control}
                                                name={`availabilities.${field.originalIndex}.startTime`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input
                                                                className="h-10 text-center text-sm bg-white"
                                                                placeholder="Inicio"
                                                                aria-label={`${dayOfWeek} Hora inicio ${labelIndex + 1}`}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <span className="text-gray-400">a</span>
                                            <FormField
                                                control={form.control}
                                                name={`availabilities.${field.originalIndex}.endTime`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input
                                                                className="h-10 text-center text-sm bg-white"
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
                                                className="h-10 w-10 text-gray-400 hover:text-red-600 hover:bg-red-50 absolute right-2"
                                                onClick={() => removeAvailability(field.originalIndex)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                            
                                            {form.formState.errors.availabilities?.[field.originalIndex]?.message && (
                                                <div className="absolute -bottom-4 left-0 right-0 text-center">
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

                <div className="flex justify-end pt-4 border-t mt-4">
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