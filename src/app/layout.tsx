import * as React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProviderComponent from "./theme-provider";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/sessionProvider/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SED",
  description: "Sistema de Eleição de Diretores",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="pt-br">
      <ThemeProviderComponent>
        <body className={inter.className}>
          <SessionProvider session={session}>{children}</SessionProvider>
        </body>
      </ThemeProviderComponent>
    </html>
  );
}
