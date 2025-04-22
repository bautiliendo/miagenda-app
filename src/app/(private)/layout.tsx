"use client";

import { NavLink } from "@/components/NavLink"
import { UserButton } from "@clerk/nextjs"
import { ReactNode, useState } from "react"
import { Menu, X } from "lucide-react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const toggleMenu = () => setOpen(!open);

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-white border-b z-50 py-2">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <NavLink 
                        href="/" 
                        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text"
                    >
                        Turnero App
                    </NavLink>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex font-medium items-center text-sm gap-6">
                        <NavLink href="/events" className="text-xl font-medium text-gray-700 hover:text-black">
                            Servicios
                        </NavLink>
                        <NavLink href="/schedule" className="text-xl font-medium text-gray-700 hover:text-black">
                            Cronograma
                        </NavLink>
                        <div className="ml-4 size-10">
                            <UserButton
                                appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
                            />
                        </div>
                    </nav>

                    {/* Mobile hamburger */}
                    <button className="cursor-pointer md:hidden text-blue-600" onClick={toggleMenu}>
                        {open ? <X size={30} /> : <Menu size={30} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {open && (
                    <nav className="md:hidden bg-white border-t px-4 py-2 flex flex-col h-[calc(100vh-64px)]">
                        {/* Menú principal */}
                        <div className="flex-grow flex flex-col gap-2 text-gray-700 text-xl">
                            <NavLink 
                                href="/events" 
                                className="font-medium" 
                                onClick={() => setOpen(false)}
                            >
                                Servicios
                            </NavLink>
                            <NavLink 
                                href="/schedule" 
                                className="font-medium" 
                                onClick={() => setOpen(false)}
                            >
                                Cronograma
                            </NavLink>
                            <div className="mt-2">
                                <UserButton
                                    appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-6 pb-4 border-t border-gray-200">
                            <div className="flex flex-col gap-3 text-sm text-gray-600">
                                <p className="font-medium text-gray-800">¿Necesitás ayuda?</p>
                                <a href="mailto:turneroapp@gmail.com" className="flex items-center gap-2 hover:text-blue-600">
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
            <main className="container my-6 mx-auto pt-16">{children}</main>
        </>
    );
}