import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { timeToInt } from "@/lib/utils"
import { z } from "zod"

export const scheduleFormSchema = z.object({
  timezone: z.string().min(1, "Obligatorio"),
  availabilities: z
    .array(
      z.object({
        dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
        startTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "La hora debe estar en formato HH:MM"
          ),
        endTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "La hora debe estar en formato HH:MM"
          ),
      })
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((availability, index) => {
        const overlaps = availabilities.some((a, i) => {
          return (
            i !== index &&
            a.dayOfWeek === availability.dayOfWeek &&
            timeToInt(a.startTime) < timeToInt(availability.endTime) &&
            timeToInt(a.endTime) > timeToInt(availability.startTime)
          )
        })

        if (overlaps) {
          ctx.addIssue({
            code: "custom",
            message: "La disponibilidad se superpone con otra",
            path: [index],
          })
        }

        if (
          timeToInt(availability.startTime) >= timeToInt(availability.endTime)
        ) {
          ctx.addIssue({
            code: "custom",
            message: "La hora de fin debe ser posterior a la hora de inicio",
            path: [index],
          })
        }
      })
    }),
})