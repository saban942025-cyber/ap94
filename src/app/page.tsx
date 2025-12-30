// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100" dir="rtl">
      <h1 className="text-4xl font-bold mb-8 text-green-700">מערכת הזמנות ח. סבן</h1>
      
      <div className="grid gap-4 text-center">
        <Link 
          href="/magic/ofer-richter" 
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition border border-green-500 text-black font-bold"
        >
          🪄 כניסה מהירה (הדמיית לינק קסם)
          <div className="text-sm text-gray-500 font-normal">עבור עופר ריכטר</div>
        </Link>

        <Link 
          href="/staff/dashboard" 
          className="p-4 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition text-gray-700"
        >
          🔒 כניסת צוות (בקרוב)
        </Link>
      </div>
    </div>
  );
}