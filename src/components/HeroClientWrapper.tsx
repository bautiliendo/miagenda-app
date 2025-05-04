"use client";

import dynamic from 'next/dynamic';

// Importa dinámicamente Hero asegurándose de que solo se renderice en el cliente
const DynamicHero = dynamic(() => import('@/sections/Hero'), { ssr: false });

export default function HeroClientWrapper() {
  // Simplemente renderiza el Hero importado dinámicamente
  return <DynamicHero />;
} 