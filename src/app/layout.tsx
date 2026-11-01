import type { Metadata } from "next";
import { Familjen_Grotesk, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { Motion } from "@/components/Motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Familjen_Grotesk({ variable: "--font-familjen", subsets: ["latin"], weight: ["500", "600", "700"] });
const sans = Public_Sans({ variable: "--font-public", subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: { default: "REAHUB | Real Estate Compliance Software", template: "%s | REAHUB" },
  description:
    "REAHUB keeps real estate brokerages and agents audit-ready with license tracking, transaction file checks and disclosure management.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Motion />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
