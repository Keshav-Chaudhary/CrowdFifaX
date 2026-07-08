import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast/Toast";
import { PersonaProvider } from "@/contexts/PersonaContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ExplainProvider } from "@/contexts/ExplainContext";
import { SimulationProvider } from "@/contexts/SimulationContext";
import { DispatchProvider } from "@/contexts/DispatchContext";
import { AlertsProvider } from "@/contexts/AlertsContext";
import { ExplainAIModal } from "@/components/ui/ExplainAIModal";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CrowdFifaX — Stadium Operations & Crowd Flow",
    template: "%s · CrowdFifaX",
  },
  description:
    "CrowdFifaX is a GenAI-enabled platform for stadium operations: monitor crowd density, predict bottlenecks, and ensure a seamless matchday experience.",
  applicationName: "CrowdFifaX",
  authors: [{ name: "CrowdFifaX" }],
  keywords: [
    "CrowdFifaX",
    "Stadium Operations",
    "Crowd Flow",
    "GenAI",
    "FIFA World Cup 2026",
    "Event Management",
  ],
  openGraph: {
    title: "CrowdFifaX — Stadium Operations & Crowd Flow",
    description:
      "Predictive AI insights and real-time telemetry for secure tournament management.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8f7" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <AccessibilityProvider>
            <LanguageProvider>
              <SimulationProvider>
                <ExplainProvider>
                  <PersonaProvider>
                    <AlertsProvider>
                      <DispatchProvider>
                        <ToastProvider>
                          {children}
                          <ExplainAIModal />
                        </ToastProvider>
                      </DispatchProvider>
                    </AlertsProvider>
                  </PersonaProvider>
                </ExplainProvider>
              </SimulationProvider>
            </LanguageProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
