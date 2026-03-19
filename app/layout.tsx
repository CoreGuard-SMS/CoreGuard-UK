import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingProvider } from "@/components/loading-provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoreGuard SMS - Smart Shift Management",
  description: "Intelligent shift scheduling and site management for security services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={montserrat.variable}>
      <body
        className="antialiased font-sans"
        style={{ fontFamily: 'var(--font-montserrat), system-ui, sans-serif' }}
      >
        <LoadingProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
