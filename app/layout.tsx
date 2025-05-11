


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import ClientWrapper from "./ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neural Impulse - AI's Impact on Life & Future",
  description: "Explore artificial intelligence: its role in life, future innovations, real-world actions, brain-inspired tech, and advanced algorithms.",
  keywords: [
    "artificial intelligence",
    "AI and life",
    "AI future",
    "AI in action",
    "AI and brain",
    "AI algorithms",
    "machine learning",
    "neural networks",
    "AI technology",
    "AI blog",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://your-vercel-app.vercel.app",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}