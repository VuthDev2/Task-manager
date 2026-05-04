import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configure Google Font
const inter = Inter({ subsets: ["latin"] });

// Define Metadata for the application
export const metadata: Metadata = {
  title: "Infinite - Task Manager", description: "Manage your team's productivity and tasks"
};

import { Toaster } from 'sonner';

// Root Layout Component
export default function RootLayout({
  children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
