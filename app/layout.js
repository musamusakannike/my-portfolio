import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Musa Musa Kannike | Fullstack Engineer",
  description:
    "High-density engineering portfolio of Musa Musa Kannike. Specialized in Fullstack Development and AI Architectures.",
  openGraph: {
    title: "Musa Musa Kannike | Fullstack Engineer",
    description:
      "High-density engineering portfolio of Musa Musa Kannike. Specialized in Fullstack Development and AI Architectures.",
    url: "https://codiac.online",
    siteName: "Musa Musa Kannike",
    images: [
      {
        url: "/meta-og.png",
        width: 1200,
        height: 630,
        alt: "Musa Musa Kannike Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musa Musa Kannike | Fullstack Engineer",
    description:
      "High-density engineering portfolio of Musa Musa Kannike. Specialized in Fullstack Development and AI Architectures.",
    images: ["/twitter-og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased bg-[#0A0A0A] text-white selection:bg-[#ADFF2F] selection:text-[#0A0A0A]`}
      >
        {children}
      </body>
    </html>
  );
}
