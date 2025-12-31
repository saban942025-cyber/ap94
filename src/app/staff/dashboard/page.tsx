'use client';
import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Plus
} from 'lucide-react';

export default function CombinedDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // orders | inventory | containers

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dir-rtl">
      
      {/* סרגל עליון - הראל */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center text-white font-bold text-lg">
              ה
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">ניהול סבן מערכות</h1>
              <p className="text-xs text-gray-500">מחובר: הראל (מנהל)</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={() => setActiveTab('orders')}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'orders' ? 'bg-[#008069] text-white' : 'bg-gray-100 text-gray-600'}`}
             >
               📋 אישור הזמנות
             </button>
             <button 
               onClick={() => setActiveTab('inventory')}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'inventory' ? 'bg-[#008069] text-white' : 'bg-gray-100 text-gray-600'}`}
             >
               📦 מלאי חומרים
             </button>
             <button 
               onClick={() => setActiveTab('containers')}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'containers' ? 'bg-[#008069] text-white' : 'bg-gray-100 text-gray-600'}`}
             >
               🚚 מכולות
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        
        {/* --- לשונית 1: אישור הזמנות (המשוחזר) --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ClipboardCheck className="text-[#008069]" />
                הזמנות ממתינות לאישור
              </h2>
              <div className="relative">
                <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="חיפוש לפי לקוח..." className="pl-4 pr-10 py-2 border rounded-full bg-white text-sm w-64" />
              </div>
            </div>

            {/* טבלת הזמנות */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-4"># הזמנה</th>
                    <th className="p-4">לקוח</th>
                    <th className="p-4">פריטים</th>
                    <th className="p-4">כתובת</th>
                    <th className="p-4">סטטוס</th>
                    <th className="p-4">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-mono font-bold">621025</td>
                    <td className="p-4">רמי עבודות עפר</td>
                    <td className="p-4">2 בלות חול, 5 מלט</td>
                    <td className="p-4">הרצל 5, ת"א</td>
                    <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">ממתין</span></td>
                    <td className="p-4 flex gap-2">
                      <button className="bg-green-100 text-green-700 p-1 rounded hover:bg-green-200"><CheckCircle size={18} /></button>
                      <button className="bg-red-100 text-red-700 p-1 rounded hover:bg-red-200"><XCircle size={18} /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-mono font-bold">621026</td>
                    <td className="p-4">יוסי קבלן שיפוצים</td>
                    <td className="p-4">מכולה 8 קוב (הצבה)</td>
                    <td className="p-4">ז'בוטינסקי 10, ר"ג</td>
                    <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">ממתין</span></td>
                    <td className="p-4 flex gap-2">
                      <button className="bg-green-100 text-green-700 p-1 rounded hover:bg-green-200"><CheckCircle size={18} /></button>
                      <button className="bg-red-100 text-red-700 p-1 rounded hover:bg-red-200"><XCircle size={18} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- לשונית 2: ניהול מלאי (המשוחזר) --- */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="text-[#008069]" />
                מצב מלאי נוכחי
              </h2>
              <button className="bg-[#008069] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <Plus size={16} /> עדכון מלאי
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* כרטיס מלאי 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Package size={24} /></div>
                   <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">תקין</span>
                </div>
                <h3 className="text-lg font-bold">חול ים (בלות)</h3>
                <p className="text-3xl font-bold mt-2">142 <span className="text-sm text-gray-400 font-normal">יח'</span></p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[70%]"></div>
                </div>
              </div>

              {/* כרטיס מלאי 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-gray-100 p-3 rounded-lg text-gray-600"><Package size={24} /></div>
                   <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">נמוך</span>
                </div>
                <h3 className="text-lg font-bold">מלט שחור</h3>
                <p className="text-3xl font-bold mt-2">15 <span className="text-sm text-gray-400 font-normal">משטחים</span></p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-red-500 w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- לשונית 3: ניהול מכולות (החדש) --- */}
        {activeTab === 'containers' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="text-[#008069]" />
              שיגור מכולות וקבלנים
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="font-bold mb-4">קליטת הזמנת מכולה</h3>
                 <div className="space-y-3">
                   <input type="text" placeholder="שם הלקוח" className="w-full p-2 border rounded bg-gray-50" />
                   <select className="w-full p-2 border rounded bg-gray-50">
                     <option>הצבה (8 קוב)</option>
                     <option>החלפה</option>
                     <option>פינוי סופי</option>
                   </select>
                   <button className="w-full bg-[#008069] text-white py-3 rounded-lg font-bold hover:bg-[#006e5a]">
                     שגר לקבלן מבצע
                   </button>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="font-bold mb-4">סטטוס מכולות בשטח</h3>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                       <div>
                         <p className="font-bold text-sm">הרצל 5 (רמי)</p>
                         <p className="text-xs text-red-500">יום 9/10 - עומד לפוג</p>
                       </div>
                       <AlertTriangle className="text-red-500" size={20} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                       <div>
                         <p className="font-bold text-sm">גן העיר (יוסי)</p>
                         <p className="text-xs text-green-500">יום 2/10 - תקין</p>
                       </div>
                       <Truck className="text-green-500" size={20} />
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
