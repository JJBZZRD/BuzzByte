import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";
import { AuthProvider } from "./components/auth/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeScript from "./components/ThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuzzByte",
  description: "Portfolio website showcasing projects and skills of John Buzzard, Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <ThemeProvider>
            <AnalyticsProvider>
              <Header />
              <main className="pt-16 md:pt-20 flex-grow">
                {children}
              </main>
              <Footer />
            </AnalyticsProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}