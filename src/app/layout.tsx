import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkinLab 011 - Tretmani ljepote i njege kože",
  description:
    "Moderni kozmetički salon u Podgorici. Tretmani lica, tijela, masaže, depilacija i više.",
  keywords:
    "kozmetički salon, Podgorica, tretmani lica, masaže, depilacija, skinlab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="me" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${montserrat.variable} antialiased`}
        style={{ fontFamily: "var(--font-body, 'Montserrat', sans-serif)" }}
      >
        {children}
      </body>
    </html>
  );
}
