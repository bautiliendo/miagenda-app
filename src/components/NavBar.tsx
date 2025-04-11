"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [openSoluciones, setOpenSoluciones] = useState(false);
    const [openFaq, setOpenFaq] = useState(false);

    const toggleMenu = () => setOpen(!open);

    return (
        <header className="fixed top-0 left-0 w-full bg-white border-b z-50 py-2">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                    MiAgenda
                </Link>

                {/* Desktop nav */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList className="flex gap-6 items-center">
                        {/* Soluciones dropdown */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-xl font-medium text-gray-700 hover:text-black bg-white hidden lg:flex">
                                Soluciones
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-white p-4 rounded shadow-md">
                                <ul className="grid gap-3 p-2 w-48">
                                    <li><a href="#barberias" className="hover:text-blue-600">Barberías</a></li>
                                    <li><a href="#salones" className="hover:text-blue-600">Salones de belleza</a></li>
                                    <li><a href="#peluquerias" className="hover:text-blue-600">Peluquerías</a></li>
                                    <li><a href="#spa" className="hover:text-blue-600">Spa y estética</a></li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Preguntas frecuentes dropdown */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-xl font-medium text-gray-700 hover:text-black bg-white hidden lg:flex">
                                Preguntas frecuentes
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-white p-4 rounded shadow-md">
                                <ul className="grid gap-3 p-2 w-64">
                                    <li><a href="#faq-precio" className="hover:text-blue-600">¿Cuánto cuesta usar MiAgenda?</a></li>
                                    <li><a href="#faq-turnos" className="hover:text-blue-600">¿Cómo gestiono mis turnos?</a></li>
                                    <li><a href="#faq-clientes" className="hover:text-blue-600">¿Pueden mis clientes agendarse solos?</a></li>
                                    <li><a href="#faq-clientes" className="hover:text-blue-600">¿Necesito conocimientos técnicos para usarla?</a></li>
                                    <li><a href="#faq-clientes" className="hover:text-blue-600">¿Funciona desde el celular?</a></li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <a href="#pricing" className="text-xl font-medium text-gray-700 hover:text-black transition-colors">
                                Precios
                            </a>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Button
                                variant="outline"
                                className="ml-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-xl"
                            >
                                Ingresar a mi cuenta
                            </Button>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Button className="ml-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium hover:from-blue-600 hover:to-blue-800 text-xl">
                                Prueba gratis
                            </Button>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Mobile hamburger */}
                <button className="md:hidden text-blue-600" onClick={toggleMenu}>
                    {open ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <nav className="md:hidden bg-white border-t px-4 py-2 flex flex-col h-[calc(100vh-64px)]"> {/* Ajusta si tu header es más alto */}
                    <div className="flex-grow flex flex-col gap-2 text-gray-700 text-xl overflow-y-auto">
                        {/* Soluciones */}
                        <div>
                            <button
                                className="w-full text-left font-medium flex items-center justify-between"
                                onClick={() => setOpenSoluciones(!openSoluciones)}
                            >
                                Soluciones <ChevronDown className={`ml-2 transition-transform text-blue-600 ${openSoluciones ? 'rotate-180' : ''}`} size={20} />
                            </button>
                            {openSoluciones && (
                                <div className="ml-4 mt-2 flex flex-col gap-1">
                                    <a href="#barberias" onClick={() => setOpen(false)}>Barberías</a>
                                    <a href="#salones" onClick={() => setOpen(false)}>Salones de belleza</a>
                                    <a href="#peluquerias" onClick={() => setOpen(false)}>Peluquerías</a>
                                    <a href="#spa" onClick={() => setOpen(false)}>Spa y estética</a>
                                </div>
                            )}
                        </div>

                        {/* Preguntas frecuentes */}
                        <div>
                            <button
                                className="w-full text-left font-medium flex items-center justify-between"
                                onClick={() => setOpenFaq(!openFaq)}
                            >
                                Preguntas frecuentes <ChevronDown className={`ml-2 transition-transform text-blue-600 ${openFaq ? 'rotate-180' : ''}`} size={20} />
                            </button>
                            {openFaq && (
                                <div className="ml-4 mt-2 flex flex-col gap-1">
                                    <a href="#faq-precio" onClick={() => setOpen(false)}>¿Cuánto cuesta usar MiAgenda?</a>
                                    <a href="#faq-turnos" onClick={() => setOpen(false)}>¿Cómo gestiono mis turnos?</a>
                                    <a href="#faq-clientes" onClick={() => setOpen(false)}>¿Pueden mis clientes agendarse solos?</a>
                                </div>
                            )}
                        </div>

                        {/* Precios */}
                        <a href="#pricing" className="font-medium" onClick={() => setOpen(false)}>
                            Precios
                        </a>
                    </div>

                    {/* Botones fijos abajo */}
                    <div className="mt-4 flex flex-col gap-2">
                        <Button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium hover:from-blue-600 hover:to-blue-800 text-xl w-full">
                            Prueba gratis
                        </Button>
                        <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xl w-full"
                        >
                            Ingresar a mi cuenta
                        </Button>

                        {/* Info de contacto */}
                        <div className="mt-4 text-center text-sm text-gray-500">
                            <p>juanbautistaliendo1@gmail.com</p>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}
