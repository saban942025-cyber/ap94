'use client';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from 'react';

// ה-Config שסיפקת
const firebaseConfig = {
  apiKey: "AIzaSyC2QjUvjfALcuoM1xZMVDIXcNpwCG1-tE8",
  authDomain: "saban-system-v2.firebaseapp.com",
  projectId: "saban-system-v2",
  storageBucket: "saban-system-v2.firebasestorage.app",
  messagingSenderId: "670637185194",
  appId: "1:670637185194:web:e897482997e75c110898d3",
  measurementId: "G-9JNS1ZJLDX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [formData, setFormData] = useState({
    customerName: '',
    orderType: 'חומרי בניין',
    address: '',
    orderDetails: ''
  });

  const sendOrder = async () => {
    if (!formData.customerName || !formData.orderDetails) {
      alert("אחי, תמלא שם ופרטי הזמנה");
      return;
    }

    try {
      // 1. שמירה ב-Firebase
      const docRef = await addDoc(collection(db, "orders"), {
        ...formData,
        status: "נשלח",
        timestamp: new Date()
      });

      // 2. בניית הודעת ווטסאפ
      const whatsappMsg = `*הזמנה חדשה - סבן 94* 🚛\n\n*לקוח:* ${formData.customerName}\n*סוג:* ${formData.orderType}\n*פירוט:* ${formData.orderDetails}\n*כתובת:* ${formData.address}\n\n*מספר מעקב:* ${docRef.id}`;
      const encodedMsg = encodeURIComponent(whatsappMsg);
      const whatsappUrl = `https://wa.me/972508860896?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.error("שגיאה:", e);
      alert("הייתה בעיה בשמירה");
    }
  };

  return (
    <main style={{ backgroundColor: '#E5DDD5', minHeight: '100vh', display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '15px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#FFD700', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', fontWeight: 'bold' }}>S94</div>
        <div>
          <strong>סבן 94 - מחלקת הזמנות</strong><br />
          <small>פעיל כעת</small>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ background: 'white', padding: '15px', borderRadius: '15px 0 15px 15px', maxWidth: '85%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          שלום! כאן המערכת החכמה של <strong style={{ color: '#FFD700' }}>סבן חומרי בניין</strong>. 🚛<br />
          מלא את הפרטים וההזמנה תישלח אלינו לווטסאפ.
        </div>
      </div>

      {/* Input Area */}
      <div style={{ background: '#f0f0f0', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #ddd' }}>
        <input 
          type="text" placeholder="שם הלקוח / חברה" 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          onChange={(e) => setFormData({...formData, customerName: e.target.value})}
        />
        <select 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          onChange={(e) => setFormData({...formData, orderType: e.target.value})}
        >
          <option value="חומרי בניין">🏗️ חומרי בניין</option>
          <option value="הצבת מכולה">🗑️ הצבת מכולה</option>
          <option value="החלפת מכולה">🔄 החלפת מכולה</option>
          <option value="הוצאת מכולה">🚚 הוצאת מכולה</option>
        </select>
        <input 
          type="text" placeholder="כתובת לאספקה / הצבה" 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
        <textarea 
          placeholder="פירוט ההזמנה (למשל: 5 בלות חול...)" 
          rows={3}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', resize: 'none' }}
          onChange={(e) => setFormData({...formData, orderDetails: e.target.value})}
        ></textarea>
        <button 
          onClick={sendOrder}
          style={{ backgroundColor: '#25D366', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
        >
          שלח הזמנה לווטסאפ
        </button>
      </div>
    </main>
  );
}
