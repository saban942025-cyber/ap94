import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Script from "next/script";

// טעינת פונט רוביק במשקלים שונים למראה מקצועי
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
    statusBarStyle: "default", // סטטוס בר שמשתלב טבעי
    title: "Saban Systems",
  },
  formatDetection: {
    telephone: false,
  },
};

// הגדרת Viewport מקצועית:
// במובייל: נועלת את הרוחב למכשיר (כמו אפליקציה).
// במחשב: מאפשרת תצוגה רגילה.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // קריטי לתחושת "אפליקציה" בנייד
  themeColor: "#efeae2", // צבע הבר העליון תואם לרקע
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
      {/* מחלקה safe-area-view דואגת למרווחים באייפונים חדשים */}
      <body className={`${rubik.className} antialiased safe-area-view`}>
        {children}
      </body>
    </html>
  );
}
