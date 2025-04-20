"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Button } from "../ui/button"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { scheduleFormSchema } from "@/schema/schedule"
import { timeToInt } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { formatTimezoneOffset } from "@/lib/formatters"
import { Fragment, useState } from "react"
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
            timezone:
                schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
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
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}
                {form.formState.errors.availabilities && (
                    <div className="text-destructive text-sm">
                        Hay horarios superpuestos. Por favor, corrige los horarios que se superponen.
                    </div>
                )}
                {successMessage && (
                    <div className="text-green-500 text-sm">{successMessage}</div>
                )}
                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Intl.supportedValuesOf("timeZone").map(timezone => (
                                        <SelectItem key={timezone} value={timezone}>
                                            {timezone}
                                            {` (${formatTimezoneOffset(timezone)})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-[auto,1fr] gap-y-6 gap-x-4">
                    {DAYS_OF_WEEK_IN_ORDER.map(dayOfWeek => (
                        <Fragment key={dayOfWeek}>
                            <div className="flex items-center gap-2">
                                <div className="capitalize text-sm font-semibold">
                                    {dayOfWeek.substring(0, 3)}
                                </div>
                                <Button
                                    type="button"
                                    className="size-6 p-1"
                                    variant="outline"
                                    onClick={() => {
                                        addAvailability({
                                            dayOfWeek,
                                            startTime: "9:00",
                                            endTime: "17:00",
                                        })
                                    }}
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {groupedAvailabilityFields[dayOfWeek]?.map(
                                    (field, labelIndex) => (
                                        <div className="flex flex-col gap-1" key={field.id}>
                                            <div className="flex gap-2 items-center">
                                                <FormField
                                                    control={form.control}
                                                    name={`availabilities.${field.originalIndex}.startTime`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="w-24"
                                                                    aria-label={`${dayOfWeek} Start Time ${labelIndex + 1}`}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                -
                                                <FormField
                                                    control={form.control}
                                                    name={`availabilities.${field.originalIndex}.endTime`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="w-24"
                                                                    aria-label={`${dayOfWeek} End Time ${labelIndex + 1}`}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    className="size-6 p-1"
                                                    variant="destructiveGhost"
                                                    onClick={() => removeAvailability(field.originalIndex)}
                                                >
                                                    <X />
                                                </Button>
                                            </div>
                                            <div className="text-destructive text-sm">
                                                {form.formState.errors.availabilities?.[field.originalIndex]?.message}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </Fragment>
                    ))}
                </div>

                <div className="flex gap-2 justify-end">
                    <Button disabled={form.formState.isSubmitting} type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}