import "./globals.css";
import { Outfit } from "next/font/google";
import {
  ClerkProvider,
  // SignInButton,
  // SignUpButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from '@clerk/nextjs'

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "MiAgenda",
  description: "Sistema de agenda de turnos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>

      <html lang="es">
        <body className={outfit.className}>{children}</body>
      </html>

    </ClerkProvider>
  );
}
