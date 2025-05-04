"use client";

import dynamic from 'next/dynamic';

// Importa dinámicamente Navbar asegurándose de que solo se renderice en el cliente
const DynamicNavbar = dynamic(() => import('@/components/NavBar'), { ssr: false });

export default function NavbarClientWrapper() {
  // Simplemente renderiza el Navbar importado dinámicamente
  return <DynamicNavbar />;
} 