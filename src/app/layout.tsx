import type { Metadata } from "next";
import { Lato, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chalapathi University | Premier University in Andhra Pradesh",
  description:
    "Chalapathi University is the Best University in Andhra Pradesh, located in Guntur, India. Empowering learners to innovate, lead and create a better tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${sourceSans3.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
