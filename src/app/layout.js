import { DM_Serif_Display, Outfit } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Cloud Kitchen — Pure Veg",
  description: "Fresh, wholesome vegetarian meals delivered to your door. Order from our curated menu of pure veg delights.",
  keywords: "cloud kitchen, vegetarian, pure veg, food delivery, fresh meals",
  openGraph: {
    title: "Cloud Kitchen — Pure Veg",
    description: "Fresh, wholesome vegetarian meals delivered to your door.",
    type: "website",
    siteName: "Cloud Kitchen",
  },
  twitter: {
    card: "summary",
    title: "Cloud Kitchen — Pure Veg",
    description: "Fresh, wholesome vegetarian meals delivered to your door.",
  },
};

export const viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${dmSerif.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
