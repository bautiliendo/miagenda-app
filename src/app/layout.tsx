import "./globals.css";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  // SignInButton,
  // SignUpButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "AgendIA",
  description: "Sistema de agenda de turnos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>

      <html lang="es">
        <body className={inter.className}>{children}</body>
      </html>

    </ClerkProvider>
  );
}
