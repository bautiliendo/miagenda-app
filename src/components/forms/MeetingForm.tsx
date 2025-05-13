"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
//   FormDescription,
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
  // formatTimezoneOffset,
} from "@/lib/formatters"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { isSameDay } from "date-fns"
import { useMemo } from "react"
import { toZonedTime } from "date-fns-tz"
import { createMeeting } from "@/server/actions/meetings"

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
      date: undefined,
      startTime: undefined,
    },
  })

  const timezone = "America/Cordoba"
  const date = form.watch("date")

  const validTimesInTimezone = useMemo(() => {
    const zonedTimes = validTimes.map(date => toZonedTime(date, timezone));
    // console.log("Valid Times in Timezone (", timezone, "):", zonedTimes);
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

  // Define styles for DayPicker to integrate visually
  const dayPickerStyles = `
    .rdp {
      --rdp-cell-size: 42px;
      --rdp-accent-color: rgb(37 99 235); /* blue-600 */
      --rdp-background-color: rgb(239 246 255); /* blue-50 */
      margin: 0;
      border-radius: 0.75rem;
      border: 1px solid rgb(229 231 235); /* gray-200 */
      padding: 1rem;
      background-color: white;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    .rdp-months {
      justify-content: center;
    }

    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: rgb(239 246 255) !important; /* blue-50 */
      color: rgb(37 99 235); /* blue-600 */
    }

    .rdp-day_selected, 
    .rdp-day_selected:focus-visible, 
    .rdp-day_selected:hover {
      background-color: rgb(37 99 235) !important; /* blue-600 */
      color: white !important;
      font-weight: 600;
    }

    .rdp-button {
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
      width: var(--rdp-cell-size);
      height: var(--rdp-cell-size);
    }

    .rdp-button[disabled] {
      opacity: 0.25;
    }

    .rdp-caption_label {
      font-weight: 600;
      font-size: 0.95rem;
      color: rgb(17 24 39); /* gray-900 */
      text-transform: capitalize;
      margin: 0 1rem;
    }

    .rdp-nav {
      gap: 0.5rem;
    }

    .rdp-nav_button {
      border: 1px solid rgb(229 231 235); /* gray-200 */
      border-radius: 0.5rem;
      padding: 0.4rem;
      color: rgb(75 85 99); /* gray-600 */
      background-color: white;
      transition: all 0.2s;
    }

    .rdp-nav_button:hover {
      background-color: rgb(239 246 255); /* blue-50 */
      color: rgb(37 99 235); /* blue-600 */
      border-color: rgb(191 219 254); /* blue-200 */
    }

    .rdp-table {
      margin: 0.75rem 0 0.25rem;
    }

    .rdp-head_cell {
      font-size: 0.75rem;
      font-weight: 500;
      color: rgb(107 114 128); /* gray-500 */
      text-transform: uppercase;
      padding-bottom: 0.75rem;
    }

    .rdp-day {
      border-radius: 0.5rem;
    }

    .rdp-day_today:not(.rdp-day_selected) {
      color: rgb(37 99 235); /* blue-600 */
      font-weight: 600;
      background-color: rgb(239 246 255); /* blue-50 */
    }

    .rdp-day_outside {
      opacity: 0.3;
    }
  `;

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

        <div className="flex gap-4 flex-col md:flex-row">
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