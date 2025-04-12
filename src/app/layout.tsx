import { QueryClientLayout } from "@/layouts";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
          {children}
        </QueryClientLayout>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
