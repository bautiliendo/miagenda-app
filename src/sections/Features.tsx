"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  DollarSign,
  FileText,
  UserCheck,
  MessageSquareHeart,
} from "lucide-react";

const features = [
  {
    icon: <Clock size={24} />,
    title: "Evitá cancelaciones de último minuto",
    description:
      "Recordatorios y confirmaciones automáticas por WhatsApp o email antes de cada cita.",
  },
  {
    icon: <Calendar size={24} />,
    title: "Agenda Online 24/7",
    description:
      "Permití que reserven en cualquier momento sin necesidad de llamarte.",
  },
  {
    icon: <DollarSign size={24} />,
    title: "Control total de tu negocio",
    description:
      "Llevá un registro de cuánto ganás, tu crecimiento mensual y evolución de clientes.",
  },
  {
    icon: <FileText size={24} />,
    title: "Olvidate del papel",
    description:
      "No pierdas más tiempo anotando citas a mano. Todo queda registrado automáticamente.",
  },
  {
    icon: <UserCheck size={24} />,
    title: "Mejorá tu imagen profesional",
    description:
      "Brindá una experiencia moderna y organizada a tus clientes desde el primer contacto.",
  },
  {
    icon: <MessageSquareHeart size={24} />,
    title: "Escuchá a tus clientes",
    description:
      "Obtené feedback valioso con encuestas de satisfacción para optimizar tu servicio.",
  },
];

export default function Features() {
  return (
    <section id="solutions" className="py-20 px-4 max-w-6xl mx-auto scroll-mt-20 ">
      <motion.h2
        className="text-4xl font-bold text-center mb-4 text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ¿Por qué elegir AgendIA?
      </motion.h2>
      <motion.p
        className="text-gray-600 mb-12 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Todo lo que necesitás para organizar tu día y mejorar la experiencia de tus clientes.
      </motion.p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-3 rounded-full inline-flex">
                {feature.icon}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-base">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

