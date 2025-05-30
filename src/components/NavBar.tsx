"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { SignInButton, SignOutButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
    const [openSoluciones, setOpenSoluciones] = useState(false);
    const [openFaq, setOpenFaq] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 w-full bg-white border-b z-50 py-2">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                    AgendIA
                </Link>

                {/* Desktop nav */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="flex gap-6 items-center">
                        {/* Soluciones dropdown */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-base font-medium text-gray-700 hover:text-black bg-white hidden lg:flex">
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
                            <NavigationMenuTrigger className="text-base font-medium text-gray-700 hover:text-black bg-white hidden lg:flex">
                                <a href="#faq">
                                    Preguntas frecuentes
                                </a>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-white p-4 rounded shadow-md">
                                <ul className="grid gap-3 p-2 w-64">
                                    <li><a href="#faq" className="hover:text-blue-600">¿Cuánto cuesta usar AgendIA?</a></li>
                                    <li><a href="#faq" className="hover:text-blue-600">¿Cómo gestiono mis turnos?</a></li>
                                    <li><a href="#faq" className="hover:text-blue-600">¿Pueden mis clientes agendarse solos?</a></li>
                                    <li><a href="#faq" className="hover:text-blue-600">¿Necesito conocimientos técnicos para usarla?</a></li>
                                    <li><a href="#faq" className="hover:text-blue-600">¿Funciona desde el celular?</a></li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <SignedIn>
                            <NavigationMenuItem>
                                <a href="#pricing" className="text-base font-medium text-gray-700 hover:text-black transition-colors">
                                    Precios
                                </a>

                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/events" className="text-base font-medium text-gray-700 hover:text-black transition-colors mx-2 flex items-center gap-1">
                                    Mi Negocio
                                    <ExternalLink className="h-4 w-4" />
                                </Link>

                            </NavigationMenuItem>
                        </SignedIn>


                        <SignedOut>
                            <NavigationMenuItem>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="cursor-pointer ml-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-base"
                                >
                                    <SignInButton>
                                        <span>Iniciar Sesión</span>
                                    </SignInButton>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="cursor-pointer ml-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-base"
                                >
                                    <SignUpButton>
                                        <span>Registrarse</span>
                                    </SignUpButton>
                                </Button>
                            </NavigationMenuItem>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Mobile menu */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <button className="cursor-pointer lg:hidden text-blue-600" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={30} />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 [&>button]:hidden">
                        <div className="flex flex-col h-full">
                            <div className="px-3 py-6">
                                <div className="mb-4">
                                    <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                                            AgendIA
                                        </span>
                                    </Link>
                                </div>
                                <div className="space-y-1">
                                    {/* Soluciones */}
                                    <div>
                                        <button
                                            className="w-full text-left font-medium flex items-center justify-between text-gray-700 text-base py-4"
                                            onClick={() => setOpenSoluciones(!openSoluciones)}
                                        >
                                            Soluciones <ChevronDown className={`ml-2 transition-transform text-blue-600 ${openSoluciones ? 'rotate-180' : ''}`} size={20} />
                                        </button>
                                        {openSoluciones && (
                                            <div className="ml-4 mt-2 flex flex-col gap-1">
                                                <a className="hover:text-blue-600 " >Profesionales independientes</a>
                                                <a className="hover:text-blue-600" >Peluquerías</a>
                                                <a className="hover:text-blue-600" >Barberías</a>
                                                <a className="hover:text-blue-600" >Salones de belleza</a>
                                                <a className="hover:text-blue-600" >Spa y estética</a>
                                                <a className="hover:text-blue-600" >Otros rubros con sistema de turnos</a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Preguntas frecuentes */}
                                    <div>
                                        <button
                                            className="w-full text-left font-medium flex items-center justify-between text-gray-700 text-base py-4"
                                            onClick={() => setOpenFaq(!openFaq)}
                                        >
                                            Preguntas frecuentes <ChevronDown className={`ml-2 transition-transform text-blue-600 ${openFaq ? 'rotate-180' : ''}`} size={20} />
                                        </button>
                                        {openFaq && (
                                            <div className="ml-4 mt-2 flex flex-col gap-1">
                                                <a href="#faq" className="hover:text-blue-600" onClick={closeMobileMenu}>¿Cuánto cuesta usar AgendIA?</a>
                                                <a href="#faq" className="hover:text-blue-600" onClick={closeMobileMenu}>¿Cómo gestiono mis turnos?</a>
                                                <a href="#faq" className="hover:text-blue-600" onClick={closeMobileMenu}>¿Pueden mis clientes agendarse solos?</a>
                                                <a href="#faq" className="hover:text-blue-600" onClick={closeMobileMenu}>¿Necesito conocimientos técnicos para usarla?</a>
                                                <a href="#faq" className="hover:text-blue-600" onClick={closeMobileMenu}>¿Funciona desde el celular?</a>
                                            </div>
                                        )}
                                    </div>

                                    <a href="#pricing" className="text-base font-medium text-gray-700 hover:text-black transition-colors block py-4" onClick={closeMobileMenu}>
                                        Precios
                                    </a>
                                    <SignedIn>
                                        <Link href="/events" className="text-base font-medium text-gray-700 hover:text-black transition-colors  py-4 flex items-center gap-2" onClick={closeMobileMenu}>
                                            Mi Negocio
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    </SignedIn>

                                    <SignedOut>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 text-xl"
                                                onClick={closeMobileMenu}
                                            >
                                                <SignInButton>
                                                    <span>Iniciar Sesión</span>
                                                </SignInButton>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 text-xl"
                                                onClick={closeMobileMenu}
                                            >
                                                <SignUpButton>
                                                    <span>Registrarse</span>
                                                </SignUpButton>
                                            </Button>
                                        </div>
                                    </SignedOut>
                                </div>
                            </div>

                            {/* Footer with account section */}
                            <div className="mt-auto px-3 py-4 border-t border-gray-200">
                                <SignedIn>
                                    <div className="mb-4">
                                        <div className="w-full flex items-center gap-x-2 text-gray-600 text-sm font-[500] pl-6 py-4 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                            <div className="h-5 w-5 -ml-2 mb-1">
                                                <UserButton
                                                    appearance={{
                                                        elements: { userButtonPopoverCard: { pointerEvents: "initial" } },
                                                    }}
                                                />
                                            </div>
                                            <span className="pl-2">Mi cuenta</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                                            asChild
                                            onClick={closeMobileMenu}
                                        >
                                            <SignOutButton>
                                                <span>Cerrar sesión</span>
                                            </SignOutButton>
                                        </Button>
                                    </div>
                                </SignedIn>


                                <div className="flex flex-col gap-3 text-sm text-gray-600">
                                    <p className="font-medium text-gray-800">¿Necesitás ayuda?</p>
                                    <a href="mailto:agendia@gmail.com" className="flex items-center gap-2 hover:text-blue-600">
                                        <Mail className="h-4 w-4" />
                                        <span>agendia@gmail.com</span>
                                    </a>
                                    <div className="text-xs mt-2">
                                        © {new Date().getFullYear()} AgendIA. Todos los derechos reservados.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
