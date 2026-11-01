import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { Motion } from "@/components/Motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const mono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "REAHUB | Real Estate Compliance Software",
    template: "%s | REAHUB",
  },
  description:
    "REAHUB keeps NSW real estate agencies audit-ready with one file per property, trust accounting, registers and an audit log.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
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
        <main className="flex-1 pt-20 sm:pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
