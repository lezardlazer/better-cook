import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Header } from "@/components/Header";
import { DropdownProvider } from "@/components/DropdownProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Better Cook",
  description: "Centralise et standardise tes recettes web, TikTok, Instagram et YouTube.",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Better Cook",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD53D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FBF4E6] font-sans text-[#14110F]">
        <DropdownProvider>
          <Header />
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
            {children}
          </main>
        </DropdownProvider>
      </body>
    </html>
  );
}
