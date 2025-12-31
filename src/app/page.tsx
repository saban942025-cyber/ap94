'use client';
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Truck, Home, User, Package, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Order, Container } from '@/lib/types';

export default function ClientApp() {
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    // מאזין להזמנה אחרונה של לקוח 123 (זמני)
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setActiveOrder({ id: snapshot.docs[0].id, ...data });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#efeae2]"><Loader2 className="animate-spin text-[#008069] w-10 h-10"/></div>;

  return (
    <div className="min-h-screen bg-[#efeae2] pb-24 text-gray-800 font-sans">
      <header className="bg-[#008069] text-white p-4 shadow-md sticky top-0 z-10 safe-area-view">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">ר</div>
            <div><h1 className="font-bold text-lg">סבן מערכות</h1><p className="text-xs opacity-80 text-white">שלום, רמי קבלן</p></div>
          </div>
          <button className="bg-white/20 p-2 rounded-full"><MessageCircle size={20} /></button>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto space-y-4">
        {/* ווידג'ט הזמנה חיה */}
        {activeOrder ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border-r-4 border-[#008069] relative">
             <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 rounded-br-lg font-bold">סטטוס חי</div>
             <div className="flex justify-between items-start mb-3">
               <div><h3 className="font-bold text-gray-800 text-lg">הזמנה פעילה</h3><p className="text-gray-500 text-sm">{new Date(activeOrder.timestamp?.seconds * 1000).toLocaleDateString()}</p></div>
               <div className="bg-[#e7fce3] text-[#008069] px-3 py-1 rounded-full text-xs font-bold shadow-sm">{activeOrder.status === 'new' ? 'התקבל' : activeOrder.status === 'processing' ? 'בטיפול' : 'נמסר'}</div>
             </div>
             <div className="bg-gray-50 p-2 rounded text-sm mb-2">{activeOrder.items?.map((i:any,idx:number)=><div key={idx}>{i.quantity} {i.name}</div>)}</div>
          </div>
        ) : <div className="bg-white p-6 text-center rounded-xl shadow-sm">אין הזמנות פעילות</div>}

        {/* מד מכולה */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3"><Truck className="text-[#008069]" /><h2 className="font-bold text-gray-800">מכולה פעילה (הרצל 5)</h2></div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between"><div><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">בתוקף</span></div><div className="text-right"><span className="text-xs font-semibold inline-block text-green-600">נותרו 3 ימים</span></div></div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100"><div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#008069]"></div></div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 safe-area-view shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 max-w-7xl mx-auto">
          <button className="flex flex-col items-center text-[#008069]"><Home size={24}/><span className="text-[10px]">ראשי</span></button>
          <button className="flex flex-col items-center text-gray-400"><Package size={24}/><span className="text-[10px]">חומרים</span></button>
          <div className="-mt-8 bg-[#008069] p-3 rounded-full text-white shadow-lg border-4 border-[#efeae2]"><Truck size={28} /></div>
          <button className="flex flex-col items-center text-gray-400"><AlertCircle size={24}/><span className="text-[10px]">מכולות</span></button>
          <button className="flex flex-col items-center text-gray-400"><User size={24}/><span className="text-[10px]">פרופיל</span></button>
        </div>
      </nav>
    </div>
  );
}
