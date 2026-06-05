import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScholarFlow - AI Study Assistant",
  description: "Academic Progress & AI Study Assistant for effective learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
