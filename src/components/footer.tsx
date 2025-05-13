import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">AgendIA</span>
                        <span className="text-sm text-gray-500">© {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Descubre AgendIA
                        </Link>
                        <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Términos y Condiciones
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}