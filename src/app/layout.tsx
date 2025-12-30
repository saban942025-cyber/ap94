import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Script from "next/script";

// הגדרת פונט רוביק למראה מקצועי וקריא בעברית
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
    statusBarStyle: "black-translucent", // משתלב עם המסך באייפון
    title: "Saban Systems",
  },
  formatDetection: {
    telephone: false, // מונע ממספרים להפוך ללינקים כחולים מכוערים
  },
};

// הגדרות Viewport קריטיות למובייל - נותן תחושת Native App
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // מונע זום (הכי חשוב לתחושת אפליקציה)
  themeColor: "#008069", // צבע הבר העליון (ירוק סבן)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* טעינת OneSignal להתראות */}
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
                notifyButton: {
                  enable: true,
                  colors: {
                    'circle.background': 'rgb(220, 38, 38)',
                    'circle.foreground': 'white',
                    'badge.background': 'rgb(220, 38, 38)',
                    'badge.foreground': 'white',
                    'badge.bordercolor': 'white',
                    'pulse.color': 'white',
                    'dialog.button.background.hovering': 'rgb(200, 30, 30)',
                    'dialog.button.background.active': 'rgb(200, 30, 30)',
                    'dialog.button.background': 'rgb(220, 38, 38)',
                    'dialog.button.foreground': 'white'
                  },
                },
                allowLocalhostAsSecureOrigin: true,
              });
            });
          `}
        </Script>
      </head>
      {/* safe-area-view דואג שהתוכן לא יוסתר ע"י המגרעת באייפון */}
      <body className={`${rubik.className} antialiased safe-area-view`}>
        {children}
      </body>
    </html>
  );
}
