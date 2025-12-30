import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // 1. ייבוא הרכיב לסקריפטים

const rubik = Rubik({ subsets: ["hebrew", "latin"] });

export const metadata: Metadata = {
  title: "Saban Systems",
  description: "מערכת ניהול הזמנות חכמה",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* 2. הטמעת הסקריפט החיצוני של OneSignal */}
        <Script 
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
          defer 
          strategy="afterInteractive" 
        />
        
        {/* 3. הטמעת קוד האתחול של OneSignal עם ה-App ID שלך */}
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "07b81f2e-e812-424f-beca-36584b12ccf2",
                safari_web_id: "web.onesignal.auto.bf4567-your-safari-id", // אופציונלי
                notifyButton: {
                  enable: true, /* מציג כפתור פעמון קטן להרשמה */
                },
                allowLocalhostAsSecureOrigin: true, /* מאפשר בדיקות במחשב שלך */
              });
            });
          `}
        </Script>
      </head>
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
