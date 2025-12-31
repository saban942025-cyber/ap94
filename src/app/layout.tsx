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

// שומר על תחושת אפליקציה במובייל (מונע זום)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#efeae2", // צבע הרקע
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full bg-[#efeae2]">
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
      
      {/* גוף האתר: במובייל הוא 100%, במחשב הוא מוגבל לרוחב מקצועי וממורכז */}
      <body className={`${rubik.className} antialiased h-full safe-area-view`}>
        <main className="min-h-screen w-full mx-auto max-w-7xl sm:px-6 lg:px-8 bg-[#efeae2]">
           {children}
        </main>
      </body>
    </html>
  );
}
