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
  title: "Breshop | Moda Sustentável, Comunidade Real",
  description: "Encontre peças únicas e estilosas em brechós selecionados. Seu brechó ganha visibilidade, clientes encontram estilo único.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-192x192.png", sizes: "192x192" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Breshop | Moda Sustentável, Comunidade Real",
    description: "Seu brechó ganha visibilidade. Clientes encontram estilo único.",
    url: "https://breshop-frontend.vercel.app",
    siteName: "Breshop",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Breshop - Marketplace para brechós",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Breshop",
    description: "Moda sustentável, comunidade real",
    images: ["/og-image.png"],
  },
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
