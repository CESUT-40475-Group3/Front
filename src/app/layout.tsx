// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Professional Networking Platform',
  description: 'Connect with professionals and grow your network',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className="antialiased bg-gray-50">{children}</body>
    </html>
  );
}
