import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Saban Systems",
  description: "מערכת ניהול הזמנות חכמה",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Saban Systems",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#008069",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <Script 
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
          defer 
          strategy="afterInteractive" 
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "07b81f2e-e812-424f-beca-36584b12ccf2",
                safari_web_id: "web.onesignal.auto.bf4567-your-safari-id",
                notifyButton: { enable: true },
              });
            });
          `}
        </Script>
      </head>
      <body className={`${rubik.className} antialiased bg-[#e5ddd5]`}>
        {/* זו המעטפת שתכריח את האתר להיראות כמו אפליקציה גם במחשב */}
        <div className="max-w-md mx-auto min-h-screen bg-[#efeae2] shadow-2xl overflow-x-hidden relative">
          {children}
        </div>
      </body>
    </html>
  );
}
