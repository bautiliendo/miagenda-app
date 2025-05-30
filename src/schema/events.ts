import { z } from "zod"

export const eventFormSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  isActive: z.boolean(),  // Quita el .default() para evitar problemas de tipos
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive("Duration must be greater than 0")
    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),
})