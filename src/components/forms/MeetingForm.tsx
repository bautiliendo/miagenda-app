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
  formatDate,
  formatTimeString,
  // formatTimezoneOffset,
} from "@/lib/formatters"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
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
    },
  })

  const timezone = "America/Cordoba"
  const date = form.watch("date")
  const validTimesInTimezone = useMemo(() => {
    return validTimes.map(date => toZonedTime(date, timezone))
  }, [validTimes])

  async function onSubmit(values: z.infer<typeof meetingFormSchema>) {
    const data = await createMeeting({
      ...values,
      eventId,
      clerkUserId,
    })

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

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <Popover>
                <FormItem className="flex-1">
                  <FormLabel className="text-gray-700">Fecha</FormLabel>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal flex w-full bg-white border-gray-200",
                          !field.value && "text-gray-500"
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date =>
                        !validTimesInTimezone.some(time =>
                          isSameDay(date, time)
                        )
                      }
                      initialFocus
                      className="rounded-md border shadow-md"
                    />
                  </PopoverContent>
                  <FormMessage />
                </FormItem>
              </Popover>
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
                  defaultValue={field.value?.toISOString()}
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
                      .filter(time => isSameDay(time, date))
                      .map(time => (
                        <SelectItem
                          key={time.toISOString()}
                          value={time.toISOString()}
                        >
                          {formatTimeString(time)}
                        </SelectItem>
                      ))}
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