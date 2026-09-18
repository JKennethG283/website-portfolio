import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { JonathanChatbot } from "@/features/assistant/JonathanChatbot";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-inter",
  subsets: ["latin"],
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jonathan Kenneth — Portfolio",
  description:
    "AI and Software Engineer at Gradstack and UTS graduate. Explore agent workflows, financial AI, voice-first mobile products, and machine learning research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col portfolio-body">
        <div id="site-content">{children}</div>
        <JonathanChatbot />
      </body>
    </html>
  );
}
