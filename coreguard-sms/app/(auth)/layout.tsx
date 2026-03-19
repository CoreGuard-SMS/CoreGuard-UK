"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getWelcomeMessage = () => {
    if (pathname === '/login') {
      return 'WELCOME BACK TO COREGUARD UK';
    } else if (pathname === '/register') {
      return 'JOIN COREGUARD UK TODAY';
    } else if (pathname === '/register-company') {
      return 'REGISTER YOUR COMPANY WITH COREGUARD UK';
    } else if (pathname === '/join-company') {
      return 'JOIN YOUR COMPANY AT COREGUARD UK';
    }
    return 'WELCOME TO COREGUARD UK';
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      <div className="hidden lg:flex flex-col justify-between p-12 text-white relative lg:col-span-2">
        <div className="absolute inset-0">
          <img 
            src="https://iili.io/q28sMp1.jpg" 
            alt="CoreGuard Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK TO HOME
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="text-left">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">{getWelcomeMessage()}</h2>
        </div>
        </div>
      </div>

      <div className="flex items-start justify-start p-8 bg-background relative lg:col-span-3">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-2xl space-y-8">
          <div className="flex justify-center">
            <img 
              src="https://iili.io/q76YPsf.png" 
              alt="CoreGuard SMS Logo" 
              className="h-16 w-auto object-contain dark:hidden"
            />
            <img 
              src="https://iili.io/q76sBKg.png" 
              alt="CoreGuard SMS Logo" 
              className="h-16 w-auto object-contain hidden dark:block"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
