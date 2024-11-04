import type { Metadata } from "next";
import { EB_Garamond, Merriweather } from "next/font/google";
import "./globals.scss";

const merriweather = Merriweather({ 
  weight: ['400', '700'],
  subsets: ["latin"], 
  variable: '--font-merriweather' 
});

const ebGaramond = EB_Garamond({ 
  weight: ['500', '600', '700'],
  subsets: ["latin"], 
  variable: '--font-garamond' 
});

export const metadata: Metadata = {
  title: "Criar Ficha Catalográfica",
  description: "Criador de ficha catalográficas para obras literárias. Desenvolvido por Bruno Lucas Ribeiro Santos (brunolucas23@gmail.com)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${merriweather.className} ${ebGaramond.className}`}>
        {children}
        <div className="background-main"></div>
      </body>
    </html>
  );
}
