'use client';
import React, { useState } from 'react';
import { Truck, Home, User, Package, MessageCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClientApp() {
  // דאמי-דאטה להמחשה (בשלב הבא נחבר לפיירבייס)
  const [activeOrder] = useState({ id: '621025', status: 'התקבל במערכת', type: 'הצבת מכולה' });
  const [activeContainer] = useState({ daysLeft: 3, percent: 70 });

  return (
    <div className="min-h-screen bg-[#efeae2] pb-24">
      
      {/* 1. כותרת עליונה (Header) */}
      <header className="bg-[#008069] text-white p-4 shadow-md sticky top-0 z-10 safe-area-view">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
              ר
            </div>
            <div>
              <h1 className="font-bold text-lg">בוקר טוב, רמי</h1>
              <p className="text-xs opacity-80 text-white">סבן מערכות</p>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
             <MessageCircle size={20} />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto space-y-4">
        
        {/* 2. ווידג'ט הזמנה חיה (Live Order) */}
        {activeOrder && (
          <div className="bg-white rounded-xl p-4 shadow-sm border-r-4 border-[#008069] animate-fade-in relative overflow-hidden">
             <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 rounded-br-lg font-bold">
               בטיפול
             </div>
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h3 className="font-bold text-gray-800 text-lg">הזמנה #{activeOrder.id}</h3>
                 <p className="text-gray-500 text-sm">{activeOrder.type}</p>
               </div>
               <Link href="/chat" className="bg-[#e7fce3] text-[#008069] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                 פתח צ'אט הזמנה
               </Link>
             </div>
             <div className="bg-gray-100 rounded-lg p-2 flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-xs text-gray-600">סטטוס: {activeOrder.status}</span>
             </div>
          </div>
        )}

        {/* 3. מד המכולה (Container Meter) */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
             <Truck className="text-[#008069]" />
             <h2 className="font-bold text-gray-800">מכולה פעילה (הרצל 5)</h2>
          </div>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  בתוקף
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  נותרו {activeContainer.daysLeft} ימים
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
              <div style={{ width: `${activeContainer.percent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#008069]"></div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
               <button className="bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-100">החלפה</button>
               <button className="bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-100">פינוי</button>
               <button className="bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-100">הארכה</button>
            </div>
          </div>
        </div>

        {/* 4. באנר פרסומי/מידע */}
        <div className="bg-[#dcf8c6] rounded-xl p-4 border border-green-200 text-center">
           <p className="text-[#075e54] font-medium text-sm">🚚 זמני הגעה היום: עד 3 שעות מרגע ההזמנה</p>
        </div>

      </main>

      {/* 5. סרגל ניווט תחתון (Bottom Bar) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 safe-area-view shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 max-w-7xl mx-auto">
          <NavItem icon={<Home size={24} />} label="ראשי" active />
          <NavItem icon={<Package size={24} />} label="חומרים" />
          <div className="-mt-8 bg-[#008069] p-3 rounded-full text-white shadow-lg border-4 border-[#efeae2]">
             <Truck size={28} />
          </div>
          <NavItem icon={<AlertCircle size={24} />} label="מכולות" />
          <NavItem icon={<User size={24} />} label="פרופיל" />
        </div>
      </nav>

      {/* כפתור וואטסאפ צף */}
      <a 
        href="https://wa.me/972500000000" // החלף במספר שלך
        target="_blank"
        className="fixed bottom-20 left-4 bg-[#25D366] text-white p-3 rounded-full shadow-xl hover:scale-110 transition z-50 flex items-center justify-center"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}

// רכיב עזר לניווט
function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center justify-center w-full ${active ? 'text-[#008069]' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );
}
