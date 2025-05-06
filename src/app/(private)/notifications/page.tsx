"use client"

import { useState } from "react"
import { Mail, MessageCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)

  const [reminder24hEnabled, setReminder24hEnabled] = useState(true)
  const [reminder1hEnabled, setReminder1hEnabled] = useState(false)

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Notificaciones
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Elige cómo y cuándo tus clientes recibirán notificaciones importantes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferencias de Notificación</CardTitle>
            <CardDescription>
              Activa los canales y configura la frecuencia de los recordatorios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Canales Activos</h3>
              <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="size-5 text-gray-500" />
                  <Label htmlFor="email-notifications" className="text-base font-medium">
                    Notificaciones por Email
                  </Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                  aria-label="Activar notificaciones por email"
                />
              </div>

              <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <MessageCircle className="size-5 text-green-600" />
                  <Label htmlFor="whatsapp-notifications" className="text-base font-medium">
                    Notificaciones por WhatsApp
                  </Label>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                    Costo Adicional
                  </Badge>
                </div>
                <Switch
                  id="whatsapp-notifications"
                  checked={whatsappEnabled}
                  onCheckedChange={setWhatsappEnabled}
                  aria-label="Activar notificaciones por WhatsApp (con costo adicional)"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Recordatorios de Turnos</h3>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Checkbox 
                  id="reminder-24h"
                  checked={reminder24hEnabled}
                  onCheckedChange={(checked) => setReminder24hEnabled(Boolean(checked))}
                />
                <div className="grid gap-1.5 leading-none">
                   <Label
                    htmlFor="reminder-24h"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enviar recordatorio 24 horas antes del turno
                  </Label>
                  <p className="text-sm text-muted-foreground">
                     Recibirán una notificación un día antes de cada turno programado.
                  </p>
                </div>
              </div>
               <div className="flex items-center space-x-3 p-4 border rounded-lg">
                 <Checkbox 
                   id="reminder-1h"
                   checked={reminder1hEnabled}
                   onCheckedChange={(checked) => setReminder1hEnabled(Boolean(checked))}
                 />
                 <div className="grid gap-1.5 leading-none">
                    <Label
                     htmlFor="reminder-1h"
                     className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                   >
                     Enviar recordatorio 1 hora antes del turno
                   </Label>
                   <p className="text-sm text-muted-foreground">
                    Recibirán una notificación una hora antes de cada turno programado.
                   </p>
                 </div>
               </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={() => {
                console.log('Guardando preferencias (MVP):', {
                  emailEnabled,
                  whatsappEnabled,
                  reminder24hEnabled,
                  reminder1hEnabled,
                });
              }}
            >
              Guardar Cambios
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}