import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme";
import { ModalProvider } from "@/components/providers/modal";
import { SocketProvider } from "@/components/providers/socket";
import { QueryProvider } from "@/components/providers/query";
import { NextAuthProvider } from "@/components/providers/next-auth";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Huala Chat",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
