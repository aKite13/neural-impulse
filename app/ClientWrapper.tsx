
"use client";

import { ReactNode } from "react";
import { Providers } from "./providers";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthProvider>
        <Navbar />
        <main>{children}</main>
      </AuthProvider>
    </Providers>
  );
}