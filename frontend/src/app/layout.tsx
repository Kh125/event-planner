import type { Metadata } from "next";
import "./globals.css";
import { RouterCacheProvider } from "@/components/RouterCacheProvider";

export const metadata: Metadata = {
  title: "Event Planner",
  description: "Plan and manage your events with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RouterCacheProvider>
          {children}
        </RouterCacheProvider>
      </body>
    </html>
  );
}
