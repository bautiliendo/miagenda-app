"use client"

import { Button, ButtonProps } from "./ui/button"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

export function BookingButton({
    eventId,
    clerkUserId,
    ...buttonProps
}: Omit<ButtonProps, "children"> & {
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