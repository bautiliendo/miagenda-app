"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import type { ComponentProps } from "react"
import { Copy, CopyCheck, CopyX } from "lucide-react"

type CopyState = "idle" | "copied" | "error"

export function CopyEventButton({
    eventId,
    clerkUserId,
    ...buttonProps
  }: Omit<ComponentProps<typeof Button>, "children"> & {
    eventId: string
    clerkUserId: string
}) {
    const [copyState, setCopyState] = useState<CopyState>("idle")

    const CopyIcon = getCopyIcon(copyState)

    return (
        <Button
            {...buttonProps}
            onClick={() => {
                navigator.clipboard
                  .writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
                  .then(() => {
                    setCopyState("copied")
                    setTimeout(() => setCopyState("idle"), 2000)
                  })
                  .catch(() => {
                    setCopyState("error")
                    setTimeout(() => setCopyState("idle"), 2000)
                  })
            }}
        >
            <CopyIcon className="size-4 mr-2" />
            {getChildren(copyState)}
        </Button>
    )
}

export function CopyProfileButton({
    clerkUserId,
    ...buttonProps
  }: Omit<ComponentProps<typeof Button>, "children"> & {
    clerkUserId: string
}) {
    const [copyState, setCopyState] = useState<CopyState>("idle")

    const CopyIcon = getCopyIcon(copyState)

    return (
        <Button
            {...buttonProps}
            onClick={() => {
                navigator.clipboard
                  .writeText(`${location.origin}/book/${clerkUserId}`)
                  .then(() => {
                    setCopyState("copied")
                    setTimeout(() => setCopyState("idle"), 2000)
                  })
                  .catch(() => {
                    setCopyState("error")
                    setTimeout(() => setCopyState("idle"), 2000)
                  })
            }}
        >
            <CopyIcon className="size-4 mr-2" />
            {getChildren(copyState)}
        </Button>
    )
}

function getCopyIcon(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return Copy
    case "copied":
      return CopyCheck
    case "error":
      return CopyX
  }
}

function getChildren(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return "Copiar Link"
    case "copied":
      return "Copiado!"
    case "error":
      return "Error"
  }
}


