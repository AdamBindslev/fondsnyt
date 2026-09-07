import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FONDSNYT // Fondsovervågning for Danmark & EU",
  description: "Automatiseret overvågningsdashboard og fundraising-værktøj til danske og europæiske fonde, puljer og deadlines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 antialiased selection:bg-slate-200">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">FONDSNYT</span>
              <span>— Intelligent 3-lags overvågning (API, Diff-detection & LLM)</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Danmark & EU</span>
              <span>•</span>
              <span>Bygget til professionelt fundraisingarbejde</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
