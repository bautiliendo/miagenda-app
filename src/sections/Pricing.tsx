"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

const plans = [
  {
    name: "Básico",
    monthlyPrice: 9990,
    description: "Ideal para quienes están empezando a organizar su negocio.",
    features: [
      "Agenda online de citas ilimitadas",
      "Integración con Google Calendar",
      "1 sucursal",
      "1 profesional",
      "Recordatorios y confirmación por email",
      "Página individual de tu negocio",
    ],
    popular: true,
  },
  {
    name: "Profesional",
    // monthlyPrice: 15990,
    description: "Perfecto para quienes quieren dar un paso más.",
    features: [
      "Todo lo del plan Básico",
      "Recordatorios y confirmación por Bot de WhatsApp",
      "Estadísticas de crecimiento y rendimiento",
      "Multiples sucursales",
      "Multiples profesionales",
      "Encuestas de satisfacción",
    ],
    popular: false,
    inConstruction: true,
  },
  {
    name: "Avanzado",
    // monthlyPrice: 22990,
    description: "Para quienes buscan tener un control completo.",
    features: [
      "Todo lo del plan Profesional",
      "Fichas de cliente avanzadas y personalizables",
      "Estadísticas de crecimiento",
      "Soporte prioritario y asistencia personalizada",
    ],
    popular: false,
    inConstruction: true,
  },
];

export default function Pricing() {
  const [anual, setAnual] = useState<boolean>(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });
  };

  return (
    <section id="pricing" className="py-20 px-4 max-w-6xl mx-auto scroll-mt-20">
      <motion.h2
        className="text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Precios
      </motion.h2>
      <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
        Mantenete organizado y maximiza tu tiempo con nuestra herramienta de gestión de citas.
      </p>

      {/* SWITCH */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className="text-gray-700 font-medium">Mensual</span>
        <button
          onClick={() => setAnual(!anual)}
          className={cn(
            "relative w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition",
            anual ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <motion.div
            className="bg-white w-6 h-6 rounded-full shadow-md"
            animate={{ x: anual ? 28 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </button>
        <span className="text-gray-700 font-medium">Anual ( %20 descuento )</span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={cn(
              "relative bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col p-6 overflow-hidden",
              plan.popular && "border-blue-600",
              plan.inConstruction && "filter grayscale"
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {plan.popular && !plan.inConstruction && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Más elegido
              </div>
            )}
            {plan.inConstruction && (
              <div className="absolute top-5 right-[-35px] bg-yellow-400 text-yellow-900 text-[0.65rem] leading-tight font-semibold px-10 py-1 transform rotate-45 shadow-md whitespace-nowrap">
                Proximamente
              </div>
            )}
            <div className={cn("mb-6", plan.inConstruction && "opacity-70")}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {
                plan.monthlyPrice !== undefined
                ? anual
                  ? formatPrice(plan.monthlyPrice * 10)
                  : formatPrice(plan.monthlyPrice)
                : ''}
              </p>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-gray-700 gap-2">
                  <Check
                    size={18}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>{feature}</div>
                </li>
              ))}
            </ul>

            <button className="mt-auto bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition">
              <Link href="/sign-up">
                Empezar 30 días gratis
              </Link>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
