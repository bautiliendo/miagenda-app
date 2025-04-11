"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // Asegurate de tener esta utilidad, o reemplazalo con un simple `clsx` o concatenación

const plans = [
  {
    name: "Básico",
    price: "$7.800",
    description: "Ideal para quienes están empezando a organizar su negocio.",
    features: [
      "Agenda online de citas ilimitadas",
      "Hasta 2 profesionales",
      "Gestión de clientes",
      "Recordatorios automáticos",
      "1 Sucursal",
      "Control de ingresos",
    ],
    popular: false,
  },
  {
    name: "Profesional",
    price: "$13.800",
    description: "Perfecto para quienes quieren dar un paso más.",
    features: [
      "Todo lo del plan básico, más:",
      "Hasta 4 profesionales",
      "Estadísticas de crecimiento",
      "Recordatorios y confirmación por WhatsApp",
      "Multilpes sucursales",
      "Encuestas de satisfacción",
    ],
    popular: true,
  },
  {
    name: "Avanzado",
    price: "$18.900",
    description: "Para quienes buscan tener un control completo.",
    features: [
      "Todo lo del plan profesional, más",
      "Profesionales ilimitádos",
      "Fichas personalizadas",
      "Soporte prioritario",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <motion.h2
        className="text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Planes accesibles, sin comprometer calidad
      </motion.h2>
      <p className="text-gray-600 mb-12 text-center max-w-xl mx-auto">
        Creamos esta herramienta pensando en profesionales que buscan organizarse mejor y brindar una experiencia moderna a sus clientes.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={cn(
              "relative bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col p-6",
              plan.popular && "border-blue-600"
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Más elegido
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">{plan.price}</p>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-gray-700 gap-2">
                <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <div>{feature}</div>
              </li>
              ))}
            </ul>

            <button className="mt-auto bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition">
              Empezar 30 días gratis
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
