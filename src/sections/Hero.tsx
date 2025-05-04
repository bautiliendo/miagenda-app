'use client'

import React from 'react'
import { Button } from '@/components/ui/button';
// import dynamic from 'next/dynamic';
import Lottie from 'lottie-react';
import timeAnimation from '@/../public/animations/time.json'; // Asegurate que este path coincida

// const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Hero() {
  return (
    <section id="hero" className="w-full bg-gradient-to-b from-white to-blue-100 py-16 md:py-24 flex items-center min-h-[80vh] md:min-h-[90vh] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 md:px-4 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">

        {/* Texto a la izquierda */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mt-8 lg:mt-0 text-center lg:text-left">
            Sistema de <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">gestión de turnos para profesionales y negocios</span>
          </h1>
          <p className="mt-6 text-xl text-gray-700">
            Gestiona tus turnos y negocio fácilmente. Fideliza clientes y simplifica cobros.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 text-lg px-6 py-3 rounded-full">
              <a href="#pricing">Empezar prueba gratis</a>
            </Button>
            <span className="text-gray-600 text-sm hidden lg:flex">Empezá hoy a tener un negocio más profesional, claro y organizado.</span>
          </div>
        </div>

        {/* Animación a la derecha */}
        <div className="w-full lg:w-1/2 hidden lg:flex justify-center">
          <Lottie
            animationData={timeAnimation}
            loop
            autoplay
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  )
}
