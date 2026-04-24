import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import "@/src/app/globals.css";
import Header from "@/src/shared/components/header/Header";
import Footer from "@/src/shared/components/Footer";
import { ToastProvider } from "@/src/shared/components/ui/Toast";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Breshop",
  description: "Encontre peças únicas e estilosas em brechós selecionados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${grotesk.variable} antialiased`}
      >
        <ToastProvider>
          <Header />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
