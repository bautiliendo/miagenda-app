"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useTransition } from "react"
import { updateUserMetadata } from "@/server/actions/user"
import { UserButton } from "@clerk/clerk-react"

const profileConfigFormSchema = z.object({
    location: z.string().optional(),
    facebookUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
    instagramUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
    whatsappNumber: z.string().optional(),
})

type FormValues = z.infer<typeof profileConfigFormSchema>

export function ProfileConfigForm({
    initialData,
}: {
    initialData: {
        location?: string
        facebookUrl?: string
        instagramUrl?: string
        whatsappNumber?: string
    }
}) {
    const [isPending, startTransition] = useTransition()
    const [successMessage, setSuccessMessage] = useState<string>()

    const form = useForm<FormValues>({
        resolver: zodResolver(profileConfigFormSchema),
        defaultValues: {
            location: initialData.location || "",
            facebookUrl: initialData.facebookUrl || "",
            instagramUrl: initialData.instagramUrl || "",
            whatsappNumber: initialData.whatsappNumber || "",
        },
    })

    async function onSubmit(values: FormValues) {
        startTransition(async () => {
            const result = await updateUserMetadata(values)
            if (result?.error) {
                form.setError("root", {
                    message: "Ocurrió un error al actualizar tu perfil",
                })
            } else {
                setSuccessMessage("Perfil actualizado correctamente!")
            }
        })
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {form.formState.errors.root && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {form.formState.errors.root.message}
                        </div>
                    )}
                    {successMessage && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
                            <div className="size-2 rounded-full bg-green-500" />
                            {successMessage}
                        </div>
                    )}

                    <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                        <FormLabel className="text-gray-700">Datos de Usuario</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-2 mt-1">
                                <UserButton showName={true} />
                            </div>
                        </FormControl>
                        <FormDescription className="text-gray-600">
                            Aquí puedes ver tus datos de usuario y modificarlos
                        </FormDescription>
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                                <FormLabel className="text-gray-700">Ubicación</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-white border-gray-200"
                                        placeholder="Ciudad, Provincia"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-gray-600">
                                    Tu ubicación será visible en tu perfil público
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="facebookUrl"
                        render={({ field }) => (
                            <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                                <FormLabel className="text-gray-700">URL de Facebook</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-white border-gray-200"
                                        placeholder="https://facebook.com/tu-perfil"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-gray-600">
                                    Enlaza tu perfil de Facebook
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="instagramUrl"
                        render={({ field }) => (
                            <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                                <FormLabel className="text-gray-700">URL de Instagram</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-white border-gray-200"
                                        placeholder="https://instagram.com/tu-perfil"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-gray-600">
                                    Enlaza tu perfil de Instagram
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="whatsappNumber"
                        render={({ field }) => (
                            <FormItem className="bg-gray-50/50 p-4 rounded-lg border">
                                <FormLabel className="text-gray-700">Número de WhatsApp</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-white border-gray-200"
                                        placeholder="+54 9 11 1234-5678"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-gray-600">
                                    Tu número de WhatsApp para contacto directo
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
                        >
                            {isPending ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
} 