import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata = {
  title: "Rover UNACH — Proyecto integrador de Electricidad y Electrónica",
  description:
    "Estudio y construcción de un prototipo de rover de exploración con suspensión Rocker-Bogie. Proyecto integrador del 2° semestre de Ingeniería en Desarrollo y Tecnologías de Software, UNACH.",
  keywords: [
    "rover",
    "rocker bogie",
    "UNACH",
    "Curiosity",
    "ESP32",
    "robótica",
    "exploración",
    "holonómico",
    "proyecto integrador",
    "electricidad y electrónica",
  ],
  authors: [{ name: "Equipo Rover UNACH" }],
  openGraph: {
    title: "Rover UNACH — Proyecto integrador",
    description:
      "Estudio y construcción de un rover Rocker-Bogie a escala 1:10. Proyecto integrador de Electricidad y Electrónica, UNACH.",
    type: "website",
    locale: "es_MX",
  },
};

export const viewport = {
  themeColor: "#07070A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${jbMono.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
