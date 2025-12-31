'use client';
import React, { useState } from 'react';
import { Plus, Send, Clipboard, Truck, Clock } from 'lucide-react';

export default function StaffDashboard() {
  const [orderId, setOrderId] = useState('');

  const generateOrderId = () => {
    // מייצר מספר רנדומלי בן 6 ספרות
    const id = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#008069] mb-8">מרכז שליטה - סבן מערכות</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* עמודה 1: קליטת הזמנה (Order Intake) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="text-[#008069]" />
              הזמנה חדשה
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">לקוח</label>
                <input type="text" className="w-full p-2 border rounded-lg bg-gray-50" placeholder="הקלד שם או טלפון..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג פעולה</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-2 border rounded-lg hover:bg-green-50 text-sm">הצבה</button>
                  <button className="p-2 border rounded-lg hover:bg-green-50 text-sm">החלפה</button>
                  <button className="p-2 border rounded-lg hover:bg-green-50 text-sm">פינוי</button>
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">מספר הזמנה</label>
                 <div className="flex gap-2">
                   <input type="text" value={orderId} readOnly className="w-full p-2 border rounded-lg bg-gray-100 font-mono text-center tracking-widest font-bold" placeholder="------" />
                   <button onClick={generateOrderId} className="bg-gray-200 p-2 rounded-lg text-sm">צור</button>
                 </div>
              </div>

              <button className="w-full bg-[#008069] text-white py-3 rounded-xl font-bold hover:bg-[#006e5a] transition shadow-lg mt-4 flex items-center justify-center gap-2">
                <Send size={18} />
                שגר למערכת
              </button>
            </div>
          </div>

          {/* עמודה 2: ה"סטורי" (Live Feed) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="text-[#008069]" />
              עדכונים בזמן אמת
            </h2>

            <div className="space-y-4">
              {/* אייטם לדוגמה 1 */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <Truck size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold">הצבה הושלמה</h3>
                    <span className="text-xs text-gray-400">10:42</span>
                  </div>
                  <p className="text-sm text-gray-600">מחסן 30 (שארק) דיווח על הצבה בהרצל 5.</p>
                  <div className="mt-2 text-xs bg-white px-2 py-1 rounded border inline-block text-gray-500">
                    הזמנה #621025
                  </div>
                </div>
              </div>

              {/* אייטם לדוגמה 2 */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Clipboard size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold">הזמנה נקלטה</h3>
                    <span className="text-xs text-gray-400">10:30</span>
                  </div>
                  <p className="text-sm text-gray-600">הזמנת מכולה חדשה ללקוח "רמי עבודות עפר".</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
