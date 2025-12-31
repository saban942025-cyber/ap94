'use client';
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // הייבוא מקובץ הפיירבייס שלך
import { Truck, Home, User, Package, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Order, Container } from '@/lib/types'; // וודא שיצרת את הקובץ משלב 2

export default function ClientApp() {
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeContainer, setActiveContainer] = useState<Container | null>(null);

  // חיבור ל-Firebase בזמן אמת
  useEffect(() => {
    // 1. האזנה להזמנה האחרונה של הלקוח
    // (כרגע שמנו ID קבוע לצורך הפיתוח - בהמשך נחליף ל-User ID מההתחברות)
    const ordersRef = collection(db, 'orders');
    // שאילתה: תביא לי הזמנות של הלקוח הזה, ממוינות לפי תאריך
    const q = query(
      ordersRef, 
      where('customerId', '==', 'CLIENT_123'), // זמני
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setActiveOrder({ id: snapshot.docs[0].id, ...data } as Order);
      } else {
        setActiveOrder(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#efeae2]">
        <div className="text-[#008069] flex flex-col items-center">
          <Loader2 size={48} className="animate-spin mb-4" />
          <span className="font-bold">טוען נתונים מהמערכת...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efeae2] pb-24 text-gray-800">
      
      {/* --- כותרת (Header) --- */}
      <header className="bg-[#008069] text-white p-4 shadow-md sticky top-0 z-10 safe-area-view">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
              ר
            </div>
            <div>
              <h1 className="font-bold text-lg">סבן מערכות</h1>
              <p className="text-xs opacity-80 text-white">שלום, רמי קבלן</p>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
             <MessageCircle size={20} />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto space-y-4">
        
        {/* --- אזור 1: הזמנה חיה (אם קיימת) --- */}
        {activeOrder ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border-r-4 border-[#008069] relative overflow-hidden">
             <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 rounded-br-lg font-bold">
               סטטוס חי
             </div>
             <div className="flex justify-between items-start mb-3">
               <div>
                 <h3 className="font-bold text-gray-800 text-lg">הזמנה #{activeOrder.orderNumber}</h3>
                 <p className="text-gray-500 text-sm">
                   {activeOrder.type === 'placement' ? 'הצבת מכולה' : 
                    activeOrder.type === 'exchange' ? 'החלפת מכולה' : 'פינוי מכולה'}
                 </p>
               </div>
               <div className="bg-[#e7fce3] text-[#008069] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                 {activeOrder.status === 'received' ? 'התקבל' : 'בביצוע'}
               </div>
             </div>
             
             {/* צ'אט בוט מובנה להזמנה */}
             <div className="mt-4 border-t pt-3 flex gap-2">
                <button className="flex-1 bg-gray-50 text-xs py-2 rounded border hover:bg-gray-100">
                  ❓ מה סטטוס ההזמנה?
                </button>
                <button className="flex-1 bg-gray-50 text-xs py-2 rounded border hover:bg-gray-100">
                  ➕ הוסף פריט
                </button>
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-gray-500">אין הזמנות פעילות כרגע</p>
            <button className="mt-2 text-[#008069] font-bold text-sm">ביצוע הזמנה חדשה +</button>
          </div>
        )}

        {/* --- אזור 2: מד המכולה (Hardcoded לבינתיים עד שיהיה דאטה) --- */}
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
                  נותרו 3 ימים
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
              <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#008069]"></div>
            </div>
            
            {/* כפתורי פעולה מהירים - יוצרים הזמנה ב-Firebase */}
            <div className="grid grid-cols-3 gap-2 mt-4">
               <ActionButton label="החלפה" />
               <ActionButton label="פינוי" />
               <ActionButton label="הארכה" />
            </div>
          </div>
        </div>

      </main>

      {/* --- תפריט תחתון (Bottom Navigation) --- */}
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
    </div>
  );
}

// רכיבי עזר קטנים לשימוש בקוד למעלה
function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center justify-center w-full ${active ? 'text-[#008069]' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-[#008069] hover:text-white transition">
      {label}
    </button>
  )
}
