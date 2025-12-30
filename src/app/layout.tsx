import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Script from "next/script";

// הגדרת פונט רוביק לתמיכה מלאה בעברית
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
});

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
        {/* טעינת הסקריפט הראשי של OneSignal */}
        <Script 
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
          defer 
          strategy="afterInteractive" 
        />
        
        {/* אתחול OneSignal עם ה-ID החדש שלך */}
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "f195bc0a-4f32-4a8f-8796-927415b462c0", // ה-ID המעודכן שלך
                safari_web_id: "web.onesignal.auto.bf4567-your-safari-id", // אופציונלי
                notifyButton: {
                  enable: true, /* זה מה שמציג את הפעמון האדום! */
                  colors: { // הגדרות עיצוב לפעמון
                    'circle.background': 'rgb(220, 38, 38)', // אדום
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
                  text: {
                    'tip.state.unsubscribed': 'הירשם לקבלת התראות על הזמנות',
                    'tip.state.subscribed': 'אתה רשום להתראות',
                    'tip.state.blocked': 'התראות חסומות',
                    'message.action.subscribed': 'תודה שנרשמת!',
                    'message.action.resubscribed': 'אתה רשום מחדש להודעות',
                    'message.action.unsubscribed': 'לא תקבל יותר התראות',
                    'dialog.main.title': 'ניהול התראות',
                    'dialog.main.button.subscribe': 'הירשם',
                    'dialog.main.button.unsubscribe': 'בטל הרשמה',
                    'dialog.blocked.title': 'בטל חסימת התראות',
                    'dialog.blocked.message': 'אנא עקוב אחר ההוראות כדי לאפשר התראות.'
                  }
                },
                allowLocalhostAsSecureOrigin: true, // מאפשר עבודה גם בבדיקות מקומיות
              });
            });
          `}
        </Script>
      </head>
      <body className={`${rubik.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
