import "./globals.css";
import { TanStackProvider } from "@/providers/TanStackProvider";
import { ToasterProvider } from "@/providers/ToasterProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aspire Consent",
  icons: {
    icon: "/aspire-consent-white-logo.svg",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-white">
        <TanStackProvider>{children}</TanStackProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
