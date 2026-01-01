import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-rubik",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#008069",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Saban Systems",
  description: "Advanced Logistics Management",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full bg-[#efeae2]">
      <head>
        {/* 👇👇👇 פתרון הקסם: טעינת Tailwind חיצונית שעוקפת את כל הבעיות 👇👇👇 */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* 👆👆👆 */}
      </head>
      <body className={`${rubik.className} antialiased h-full safe-area-view`}>
        {children}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(function(OneSignal) {
              OneSignal.init({
                appId: "c180922c-a02e-436c-9467-319e71271172",
                safari_web_id: "web.onesignal.auto.6106263a-86c8-472e-9d22-1db3db0a236d",
                notifyButton: { enable: true },
                allowLocalhostAsSecureOrigin: true,
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}
