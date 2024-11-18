import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/fonts";
import UserDetailProvider from "./_components/UserDetailProvider";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/lib/context/user_context/AuthProvider";

export const metadata: Metadata = {
  title: "Bell Admin App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} bg-wave-pattern bg-cover  w-full h-screen`}
      >
        <div className="bg-gradient-to-tr from-white to-transparent w-full h-full">
          <AuthProvider>
            <UserDetailProvider>{children}</UserDetailProvider>
          </AuthProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
