"use client";

import { NavLink } from "@/components/NavLink"
import { UserButton } from "@clerk/nextjs"
import { ReactNode } from "react"
import { 
  Menu, 
  LayoutDashboard, 
  Calendar,
  Users,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Route {
    label: string;
    icon: LucideIcon;
    href: string;
    color?: string;
    variant?: 'default' | 'ghost';
}

export default function PrivateLayout({ children }: { children: ReactNode }) {
    const routes: Route[] = [
        {
            label: 'Servicios',
            icon: LayoutDashboard,
            href: '/events',
            color: 'text-blue-600',
            variant: 'default'
        },
        {
            label: 'Mi disponibilidad',
            icon: Calendar,
            href: '/schedule',
            color: 'text-violet-600',
            variant: 'default'
        },
        {
            label: 'Clientes',
            icon: Users,
            href: '#',
            variant: 'ghost'
        },
        {
            label: 'Agenda',
            icon: Calendar,
            href: '#',
            variant: 'ghost'
        },
        // {
        //     label: 'Pagos',
        //     icon: CreditCard,
        //     href: '/',
        //     variant: 'ghost'
        // },
    ];

    return (
        <div className="light">
            <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
                <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r">
                    <div className="px-3 py-2 flex-1">
                        <div className="mb-4">
                            <NavLink href="/" className="flex items-center px-4">
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
                                    Turnero App
                                </span>
                            </NavLink>
                        </div>
                        <div className="space-y-1">
                            {routes.map((route) => (
                                <NavLink
                                    key={`${route.href}-${route.label}`}
                                    href={route.href}
                                    className={cn(
                                        "w-full flex items-center gap-x-2 text-gray-600 text-sm font-[500] pl-6 py-4 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all",
                                        route.color
                                    )}
                                >
                                    <route.icon className="h-5 w-5" />
                                    {route.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className="px-3 py-2">
                        <div className="px-4 py-2">
                            <UserButton
                                appearance={{ 
                                    elements: { 
                                        userButtonAvatarBox: "size-full"
                                    } 
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:pl-64">
                <div className="flex-1 h-full">
                    <header className="fixed top-0 left-0 w-full bg-white border-b z-50 py-2 md:hidden">
                        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                            <NavLink href="/" className="md:hidden text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
                                Turnero App
                            </NavLink>
                            <div className="md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <button className="cursor-pointer text-blue-600">
                                            <Menu size={30} />
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="p-0 bg-white border-r w-72">
                                        <div className="space-y-4 py-4 flex flex-col h-full">
                                            <div className="px-3 py-2 flex-1">
                                                <div className="mb-4">
                                                    <NavLink href="/" className="flex items-center">
                                                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
                                                            Turnero App
                                                        </span>
                                                    </NavLink>
                                                </div>
                                                <div className="space-y-1">
                                                    {routes.map((route) => (
                                                        <NavLink
                                                            key={`${route.href}-${route.label}`}
                                                            href={route.href}
                                                            onClick={() => {
                                                                const closeEvent = new Event('close-sheet');
                                                                window.dispatchEvent(closeEvent);
                                                            }}
                                                            className={cn(
                                                                "w-full flex items-center gap-x-2 text-gray-600 text-sm font-[500] pl-6 py-4 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all",
                                                                route.color
                                                            )}
                                                        >
                                                            <route.icon className="h-5 w-5" />
                                                            {route.label}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="px-3 py-2">
                                                <div className="px-4 py-2">
                                                    <UserButton
                                                        appearance={{ 
                                                            elements: { 
                                                                userButtonAvatarBox: "size-full"
                                                            } 
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </header>
                    <main className="container my-6 mx-auto px-4 pt-24 md:pt-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}