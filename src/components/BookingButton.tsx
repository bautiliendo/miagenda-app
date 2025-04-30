"use client"

import { Button } from "./ui/button"
import type { ComponentProps } from "react"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

export function BookingButton({
    eventId,
    clerkUserId,
    ...buttonProps
}: Omit<ComponentProps<typeof Button>, "children"> & {
    eventId: string
    clerkUserId: string
}) {
    return (
        <Button
            {...buttonProps}
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white"
        >
            <Link href={`/book/${clerkUserId}/${eventId}`}>
                <CalendarDays className="size-4 mr-2" />
                Reservar
            </Link>
        </Button>
    )
}