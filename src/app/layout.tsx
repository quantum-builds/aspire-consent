import "./globals.css";
import { TanStackProvider } from "@/providers/TanStackProvider";
import { ToasterProvider } from "@/providers/ToasterProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <TanStackProvider>{children}</TanStackProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
