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
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
    const { isSignedIn } = useAuth();
    const [open, setOpen] = useState(false);
    const [openSoluciones, setOpenSoluciones] = useState(false);
    const [openFaq, setOpenFaq] = useState(false);

    const toggleMenu = () => setOpen(!open);

    return (
        <header className="fixed top-0 left-0 w-full bg-white border-b z-50 py-2">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                    Turnero App
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
                                    <li><a className="hover:text-blue-600">Profesionales independientes</a></li>
                                    <li><a className="hover:text-blue-600">Peluquerías</a></li>
                                    <li><a className="hover:text-blue-600">Barberías</a></li>
                                    <li><a className="hover:text-blue-600">Salones de belleza</a></li>
                                    <li><a className="hover:text-blue-600">Spa y estética</a></li>
                                    <li><a className="hover:text-blue-600">Otros rubros con sistema de turnos</a></li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Preguntas frecuentes dropdown */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-xl font-medium text-gray-700 hover:text-black bg-white hidden lg:flex">
                                <a href="#faq">
                                    Preguntas frecuentes
                                </a>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-white p-4 rounded shadow-md">
                                <ul className="grid gap-3 p-2 w-64">
                                    <li><a href="#faq" className="hover:text-blue-600">¿Cuánto cuesta usar Turnero App?</a></li>
                                    <li><a href="#faq" className="hover:text-blue-600">¿Cómo gestiono mis turnos?</a></li>
                                    <li><a href="#faq" className="hover:text-blue-600">¿Pueden mis clientes agendarse solos?</a></li>
                                    <li><a href="#faq" className="hover:text-blue-600">¿Necesito conocimientos técnicos para usarla?</a></li>
                                    <li><a href="#faq" className="hover:text-blue-600">¿Funciona desde el celular?</a></li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            {!isSignedIn && (
                                <a href="#pricing" className="text-xl font-medium text-gray-700 hover:text-black transition-colors">
                                    Precios
                                </a>
                            )}

                            {isSignedIn && (
                                <Link href="/events" className="text-xl font-medium text-gray-700 hover:text-black transition-colors mx-2 ">
                                    Mi Negocio
                                </Link>
                            )
                            }
                        </NavigationMenuItem>

                        {!isSignedIn && (
                            <NavigationMenuItem>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="cursor-pointer ml-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-xl"
                                >
                                    <SignInButton mode="modal">
                                        <span>Ir a mi cuenta</span>
                                    </SignInButton>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="cursor-pointer ml-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-xl"
                                >
                                    <SignUpButton mode="modal">
                                        <span>Registrarse</span>
                                    </SignUpButton>
                                </Button>
                            </NavigationMenuItem>
                        )}
                        {isSignedIn && <UserButton />}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Mobile hamburger */}
                <button className="cursor-pointer lg:hidden text-blue-600" onClick={toggleMenu}>
                    {open ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <nav className="lg:hidden bg-white border-t px-4 py-2 flex flex-col h-[calc(100vh-64px)]">
                    {/* Menú principal */}
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
                                    <a className="hover:text-blue-600">Profesionales independientes</a>
                                    <a className="hover:text-blue-600">Peluquerías</a>
                                    <a className="hover:text-blue-600">Barberías</a>
                                    <a className="hover:text-blue-600">Salones de belleza</a>
                                    <a className="hover:text-blue-600">Spa y estética</a>
                                    <a className="hover:text-blue-600">Otros rubros con sistema de turnos</a>
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
                                    <a href="#faq" className="hover:text-blue-600" onClick={() => setOpen(false)}>¿Cuánto cuesta usar Turnero App?</a>
                                    <a href="#faq" className="hover:text-blue-600" onClick={() => setOpen(false)}>¿Cómo gestiono mis turnos?</a>
                                    <a href="#faq" className="hover:text-blue-600" onClick={() => setOpen(false)}>¿Pueden mis clientes agendarse solos?</a>
                                    <a href="#faq" className="hover:text-blue-600" onClick={() => setOpen(false)}>¿Necesito conocimientos técnicos para usarla?</a>
                                    <a href="#faq" className="hover:text-blue-600" onClick={() => setOpen(false)}>¿Funciona desde el celular?</a>
                                </div>
                            )}
                        </div>

                        {/* Precios */}
                        <a href="#pricing" className="flex md:hidden font-medium" onClick={() => setOpen(false)}>
                            Precios
                        </a>

                        {isSignedIn && (
                            <>
                                <a href="/events" className="font-medium" onClick={() => setOpen(false)}>
                                    Mi negocio
                                </a>
                                <UserButton />
                            </>
                        )}
                    </div>

                    {/* Botones de acción */}
                    {!isSignedIn && (
                        <div className="py-4 flex flex-col gap-2 border-t border-gray-200">
                            <Button
                                onClick={() => setOpen(false)}
                                className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium hover:from-blue-600 hover:to-blue-800 text-xl w-full">
                                <a href="#pricing">Prueba gratis</a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 text-xl flex md:hidden"
                            >
                                <SignInButton mode="modal">
                                    <span>Ir a mi cuenta</span>
                                </SignInButton>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 text-xl flex md:hidden"
                            >
                                <SignUpButton mode="modal">
                                    <span>Registrarse</span>
                                </SignUpButton>
                            </Button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-6 pb-4 border-t border-gray-200">
                        <div className="flex flex-col gap-3 text-sm text-gray-600">
                            <p className="font-medium text-gray-800">¿Necesitás ayuda?</p>
                            <a href="mailto:contacto@turneroapp.com" className="flex items-center gap-2 hover:text-blue-600">
                                <span>turneroapp@gmail.com</span>
                            </a>
                            <a href="tel:+5493512431491" className="flex items-center gap-2 hover:text-blue-600">
                                <span>+5493512431491</span>
                            </a>
                            <div className="text-xs mt-2">
                                © 2024 Turnero App. Todos los derechos reservados.
                            </div>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}
