"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function updateUserMetadata(data: {
    location?: string
    facebookUrl?: string
    instagramUrl?: string
    whatsappNumber?: string
}) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return { error: "No autorizado" }
        }

        await (await clerkClient()).users.updateUser(userId, {
            publicMetadata: data
        })

        revalidatePath("/my-page/[clerkUserId]")
        return { success: true }
    } catch (error) {
        console.error("Error updating user metadata:", error)
        return { error: "Error al actualizar el perfil" }
    }
} 