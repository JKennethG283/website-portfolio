import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { JonathanChatbot } from "@/ui/assistant/JonathanChatbot";
import { CursorGlow } from "@/ui/site/CursorGlow";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jonathan Kenneth — Portfolio",
  description:
    "AI and machine learning portfolio — forecasting, financial NLP, and LLM systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col portfolio-body">
        <CursorGlow />
        {children}
        <JonathanChatbot />
      </body>
    </html>
  );
}
