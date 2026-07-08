import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export const metadata = {
  title: "Floraflyers - Your Journey, Intelligently Planned",
  description: "AI-assisted tourist agency booking platform.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="font-body bg-lightbg text-navy antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
