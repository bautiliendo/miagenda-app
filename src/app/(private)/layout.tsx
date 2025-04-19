import { NavLink } from "@/components/NavLink"
import { UserButton } from "@clerk/nextjs"
import { CalendarRange } from "lucide-react"
import { ReactNode } from "react"

export default function PrivateLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <header className="flex py-4 border-b bg-card max-w-6xl mx-auto">
                <nav className="font-medium flex items-center text-sm gap-6 container mx-auto">
                    <div className="flex items-center gap-2 font-semibold mr-auto">
                        <CalendarRange className="size-6" />
                        <NavLink href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                            MiAgenda
                        </NavLink>
                    </div>
                    <NavLink href="/events" className="text-xl font-medium text-gray-700 hover:text-black bg-white">Eventos</NavLink>
                    <NavLink href="/schedule" className="text-xl font-medium text-gray-700 hover:text-black bg-white">Cronograma</NavLink>
                    <div className="ml-auto size-10">
                        <UserButton
                            appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
                        />
                    </div>
                </nav>
            </header>
            <main className="container my-6 mx-auto">{children}</main>
        </>
    )
}