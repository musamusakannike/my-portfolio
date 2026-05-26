import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  metadataBase: new URL("https://codiac.online"),
  title: "Musa Musa Kannike | Fullstack Engineer",
  description:
    "High-density engineering portfolio of Musa Musa Kannike. Specialized in Fullstack Development and AI Architectures.",
  openGraph: {
    title: "Musa Musa Kannike | Fullstack Engineer",
    description:
      "High-density engineering portfolio of Musa Musa Kannike. Specialized in Fullstack Development and AI Architectures.",
    url: "https://codiac.online",
    siteName: "Musa Musa Kannike",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musa Musa Kannike | Fullstack Engineer",
    description:
      "High-density engineering portfolio of Musa Musa Kannike. Specialized in Fullstack Development and AI Architectures.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased bg-[#FAF9F6] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-white transition-colors duration-300 selection:bg-[#ADFF2F] selection:text-[#0A0A0A]"
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
