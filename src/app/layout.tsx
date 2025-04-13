'use client'
import { QueryClientLayout } from "@/layouts";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UnsavedChangesProvider } from "@/context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <QueryClientLayout>
          <UnsavedChangesProvider>
            {children}
          </UnsavedChangesProvider>
        </QueryClientLayout>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
