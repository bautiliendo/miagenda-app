"use client"

import { useForm } from "react-hook-form"
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
import { Input } from "../ui/input"
import Link from "next/link"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { meetingFormSchema } from "@/schema/meetings"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  formatTimeString,
} from "@/lib/formatters"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { isSameDay } from "date-fns"
import { useMemo } from "react"
import { toZonedTime } from "date-fns-tz"
import { createMeeting } from "@/server/actions/meetings"
import { dayPickerStyles } from "../DaypickerStyles"

export function MeetingForm({
  validTimes,
  eventId,
  clerkUserId,
}: {
  validTimes: Date[]
  eventId: string
  clerkUserId: string
}) {
  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      timezone: "America/Cordoba",
      guestName: "",
      guestEmail: "",
      guestNotes: "",
      guestPhone: "",
      date: undefined,
      startTime: undefined,
    },
  })

  const timezone = "America/Cordoba"
  const date = form.watch("date")

  const validTimesInTimezone = useMemo(() => {
    const zonedTimes = validTimes.map(date => toZonedTime(date, timezone));
    return zonedTimes;
  }, [validTimes])

  async function onSubmit(values: z.infer<typeof meetingFormSchema>) {
    console.log("Submitting data:", values);
    if (!values.date || !values.startTime) {
      form.setError("root", { message: "Por favor selecciona fecha y hora." });
      return;
    }
    const data = await createMeeting({
       ...values,
       eventId,
       clerkUserId,
    });

    if (data?.error) {
      form.setError("root", {
        message: "Hubo un error al guardar tu evento",
      })
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 flex-col">
        {form.formState.errors.root && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="bg-gray-50/50 p-4 rounded-lg border">
          <div className="text-gray-700 font-medium">Zona Horaria</div>
          <div className="text-gray-600 mt-1">
            Argentina (GMT-3)
          </div>
        </div>

        <div className="flex gap-4 flex-col">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <FormLabel className="text-gray-700 self-start mb-2">Fecha</FormLabel>
                <style>{dayPickerStyles}</style>
                <DayPicker
                  mode="single"
                  selected={field.value}
                  onSelect={(selectedDateValue) => {
                    console.log("DayPicker onSelect triggered! Value:", selectedDateValue);
                    field.onChange(selectedDateValue);
                  }}
                  disabled={(calendarDate) => {
                    if (calendarDate < new Date(new Date().setHours(0,0,0,0))) return true;
                    const isDisabled = !validTimesInTimezone.some(validTime =>
                      isSameDay(calendarDate, validTime)
                    );
                    return isDisabled;
                  }}
                  initialFocus={false}
                  fromMonth={new Date()}
                />
                <FormMessage className="mt-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gray-700">Horario</FormLabel>
                <Select
                  disabled={date == null}
                  onValueChange={value =>
                    field.onChange(new Date(Date.parse(value)))
                  }
                  defaultValue={field.value instanceof Date ? field.value.toISOString() : undefined}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue
                        placeholder={
                          date == null
                            ? "Primero selecciona una fecha"
                            : "Seleccionar horario"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {validTimesInTimezone
                      .filter(time => date instanceof Date && isSameDay(time, date))
                      .map(time => {
                        const formattedTime = formatTimeString(time, timezone);
                        return (
                          <SelectItem
                            key={time.toISOString()}
                            value={time.toISOString()}
                          >
                            {formattedTime}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gray-700">Nombre</FormLabel>
                <FormControl>
                  <Input className="bg-white border-gray-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guestEmail"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input type="email" className="bg-white border-gray-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guestPhone"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gray-700">Teléfono</FormLabel>
                <FormControl>
                  <Input type="tel" className="bg-white border-gray-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="guestNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Comentarios adicionales</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none bg-white border-gray-200 min-h-[100px]"
                  placeholder="Agrega cualquier información adicional que necesites compartir..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            type="button"
            asChild
            variant="outline"
            className="border-gray-200 hover:bg-gray-50"
            disabled={form.formState.isSubmitting}
          >
            <Link href={`/book/${clerkUserId}`}>Cancelar</Link>
          </Button>
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
          >
            {form.formState.isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
          </Button>
        </div>
      </form>
    </Form>
  )
}