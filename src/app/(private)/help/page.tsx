import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Preguntas específicas sobre el uso de la app
const helpFaqItems = [
  {
    id: 0,
    question: "¿Cómo cambio el nombre de mi negocio?",
    answer:
      "Ve a la sección 'Mi cuenta' en el menú lateral, presiona 'Manage account' , 'Update profile' y cambia el nombre de tu negocio."
  },{
    id: 1,
    question: "¿Cómo configuro mi horario de disponibilidad?",
    answer:
      "Ve a la sección 'Mi disponibilidad' en el menú lateral, donde podrás establecer tu horario laboral para cada día de la semana. También puedes configurar excepciones para días festivos o vacaciones."
  },
  {
    id: 2,
    question: "¿Cómo creo un nuevo servicio?",
    answer:
      "En la sección 'Servicios', haz clic en el botón '+ Nuevo servicio'. Completa el formulario con el nombre, descripción, duración y precio."
  },
  {
    id: 3,
    question: "¿Cómo personalizo los recordatorios para clientes?",
    answer:
      "Ve a 'Configuración' > 'Notificaciones' donde podrás personalizar cuándo y cómo se envían recordatorios a tus clientes. Puedes configurar mensajes por email o SMS, y definir el tiempo de anticipación."
  },
  {
    id: 4,
    question: "¿Cómo puedo cancelar o reprogramar una cita?",
    answer:
      "En la sección 'Agenda', encuentra la cita que deseas modificar y haz clic en el ícono de lápiz para editar o en el ícono de papelera para cancelar. Se notificará automáticamente al cliente sobre estos cambios."
  },
];

export default function HelpPage() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Centro de ayuda
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Aprende a utilizar todas las funciones de AgendIA para sacar el máximo provecho
          </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-16">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Guía de inicio rápido</CardTitle>
            <CardDescription>Aprende lo básico para comenzar a usar AgendIA en minutos</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Video placeholder - replace with actual video component in the future */}
            <div className="aspect-video bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 ml-1" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center font-medium">
                Video tutorial próximamente
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recursos útiles</CardTitle>
            <CardDescription>Información adicional para optimizar tu experiencia</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="text-lg font-medium mb-1">Configura tu perfil</h3>
              <p className="text-gray-600 text-sm">Personaliza tu información para que tus clientes te conozcan mejor</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="text-lg font-medium mb-1">Crea tu primer servicio</h3>
              <p className="text-gray-600 text-sm">Configura los servicios que ofreces con sus precios y duración</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="text-lg font-medium mb-1">Administra tu agenda</h3>
              <p className="text-gray-600 text-sm">Aprende a gestionar tus citas y horarios de disponibilidad</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customized FAQ section for help content */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Preguntas frecuentes sobre el uso</h2>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {helpFaqItems.map(({ id, question, answer }) => (
              <AccordionItem key={id} value={`item-${id}`}>
                <AccordionTrigger className="text-lg font-medium hover:text-blue-600 transition-colors">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">¿No encontraste lo que buscabas?</h2>
        <p className="text-lg text-gray-600 mb-6">Contáctanos y te damos una mano.</p>
        <div className="flex justify-center gap-4">
          <a
            href="mailto:agendia@gmail.com" // Replace with your actual support email
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Enviar Email
          </a>
          <a
            href="https://wa.me/5493512431491" // Replace with your actual WhatsApp number e.g., https://wa.me/5491112345678
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>

    </div>
    </div>
  );
}
