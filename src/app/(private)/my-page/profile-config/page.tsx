import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ProfileConfigForm } from "@/components/forms/ProfileConfigForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfileConfigPage() {
    const { userId } = await auth()
    if (!userId) {
        return redirect("/")
    }

    const user = await (await clerkClient()).users.getUser(userId)
    const publicMetadata = user.publicMetadata as {
        location?: string
        facebookUrl?: string
        instagramUrl?: string
        whatsappNumber?: string
    } || {}

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                        Configurar mi página
                    </h1>
                    <p className="mt-2 text-gray-600 text-lg">
                        Personaliza la información que verán tus clientes
                    </p>
                </div>

                <Card className="shadow-lg border-gray-200">
                    <CardHeader className="border-b bg-gray-50/50">
                        <CardTitle className="text-xl text-gray-800">Información de Contacto</CardTitle>
                        <CardDescription>
                            Actualiza tu información de contacto y redes sociales
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ProfileConfigForm initialData={publicMetadata} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 