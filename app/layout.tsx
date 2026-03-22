import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import Providers from "./providers";

const outfits = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const SITE_URL = "https://innovationconference.com.ng";
const SITE_NAME = "School of Innovation";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "School of Innovation is Nigeria's leading online learning platform for tech, creative, and professional skills. Learn from expert instructors, earn certificates, and build your future.",
  keywords: [
    "online learning Nigeria",
    "e-learning platform",
    "tech courses Nigeria",
    "professional development",
    "certification courses",
    "School of Innovation",
    "online education Nigeria",
    "skill acquisition",
    "instructor-led courses",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Nigeria's leading online learning platform. Earn certificates in tech, creative, and professional skills with expert instructors.",
    images: [
      {
        url: "/assets/images/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – Learn. Grow. Innovate.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Nigeria's leading online learning platform. Earn certificates in tech, creative, and professional skills.",
    images: ["/assets/images/og-image.jpeg"],
    creator: "@schoolofinnovation",
    site: "@schoolofinnovation",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfits.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster position="bottom-center" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
