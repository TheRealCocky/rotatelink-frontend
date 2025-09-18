// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Link Rotator",
    description: "Manage and rotate your links with metrics",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        </body>
        </html>
    );
}










