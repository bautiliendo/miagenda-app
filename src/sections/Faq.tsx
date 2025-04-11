"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function FAQ() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <motion.h2
        className="text-4xl font-bold text-center mb-10 text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Preguntas frecuentes
      </motion.h2>
      <motion.p
        className="text-gray-600 mb-12 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        ¿No encontraste lo que buscabas? Contactanos y te damos una mano.
      </motion.p>
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqItems.map(({ id, question, answer }) => (
            <AccordionItem key={id} value={`item-${id}`}>
              <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}

// Preguntas en un array para mantener limpio el código
const faqItems = [
  {
    id: 1,
    question: "¿Cuánto cuesta usar MiAgenda?",
    answer:
      "Contamos con diferentes planes según tus necesidades. Podés empezar con una prueba gratis y luego elegir el que mejor se adapte a vos.",
  },
  {
    id: 2,
    question: "¿Cómo gestiono mis turnos?",
    answer:
      "Desde el panel podés ver todos tus turnos, programar nuevos, reprogramar o cancelar con un clic. Además, tus clientes reciben recordatorios automáticos.",
  },
  {
    id: 3,
    question: "¿Pueden mis clientes agendarse solos?",
    answer:
      "Sí, pueden reservar turnos online en cualquier momento, sin llamarte ni escribirte. Vos recibís la notificación automáticamente.",
  },
  {
    id: 4,
    question: "¿Necesito conocimientos técnicos para usarla?",
    answer:
      "Para nada. Está pensada para que cualquier persona la pueda usar, desde el celular o la compu.",
  },
  {
    id: 5,
    question: "¿Funciona desde el celular?",
    answer:
      "Sí, podés acceder desde cualquier dispositivo sin instalar nada.",
  },
];
