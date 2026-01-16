<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>סבן 94 - הזמנה חכמה</title>
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

        // ה-Config ששלחת לי (מאובטח בתוך המודול)
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

        // פונקציית שליחת הזמנה
        async function sendOrder() {
            const name = document.getElementById('customerName').value;
            const orderDetails = document.getElementById('orderDetails').value;
            const type = document.getElementById('orderType').value;
            const address = document.getElementById('address').value;

            if(!name || !orderDetails) {
                alert("אחי, תמלא שם ופרטי הזמנה");
                return;
            }

            try {
                // 1. שמירה ב-Firebase לתיעוד
                const docRef = await addDoc(collection(db, "orders"), {
                    customerName: name,
                    type: type,
                    details: orderDetails,
                    address: address,
                    status: "נשלח",
                    timestamp: new Date()
                });

                // 2. בניית הודעת ווטסאפ קטלנית
                const whatsappMsg = `*הזמנה חדשה - סבן 94* 🚛\n\n*לקוח:* ${name}\n*סוג:* ${type}\n*פירוט:* ${orderDetails}\n*כתובת:* ${address}\n\n*מספר מעקב:* ${docRef.id}`;
                const encodedMsg = encodeURIComponent(whatsappMsg);
                const whatsappUrl = `https://wa.me/972508860896?text=${encodedMsg}`;

                // 3. שיגור
                window.open(whatsappUrl, '_blank');
            } catch (e) {
                console.error("שגיאה ברישום: ", e);
                alert("הייתה בעיה בשמירה, נסה שוב");
            }
        }
        window.sendOrder = sendOrder;
    </script>

    <style>
        :root {
            --wa-green: #25D366;
            --wa-dark-green: #075E54;
            --saban-yellow: #FFD700;
        }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #E5DDD5; margin: 0; display: flex; flex-direction: column; height: 100vh; }
        .header { background-color: var(--wa-dark-green); color: white; padding: 15px; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        .header img { border-radius: 50%; width: 40px; height: 40px; border: 2px solid var(--saban-yellow); }
        .chat-container { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
        .bubble { background: white; padding: 15px; border-radius: 15px 0 15px 15px; max-width: 85%; align-self: flex-start; box-shadow: 0 1px 2px rgba(0,0,0,0.1); position: relative; }
        .bubble::before { content: ""; position: absolute; top: 0; right: -10px; border: 10px solid transparent; border-top-color: white; border-left: 0; }
        .input-area { background: #f0f0f0; padding: 15px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid #ddd; }
        input, select, textarea { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
        button { background-color: var(--wa-green); color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
        button:hover { background-color: #128C7E; }
        .saban-tag { color: var(--saban-yellow); font-weight: bold; }
    </style>
</head>
<body>

<div class="header">
    <img src="https://via.placeholder.com/40/000000/FFFF00?text=S94" alt="Logo">
    <div>
        <strong>סבן 94 - מחלקת הזמנות</strong><br>
        <small>פעיל כעת</small>
    </div>
</div>

<div class="chat-container">
    <div class="bubble">
        שלום! כאן המערכת החכמה של <span class="saban-tag">סבן חומרי בניין</span>. 🚛<br>
        מלא את הפרטים למטה וההזמנה תתועד ותישלח אלינו לווטסאפ מיד.
    </div>
</div>

<div class="input-area">
    <input type="text" id="customerName" placeholder="שם הלקוח / חברה" required>
    <select id="orderType">
        <option value="חומרי בניין">🏗️ חומרי בניין</option>
        <option value="הצבת מכולה">🗑️ הצבת מכולה</option>
        <option value="החלפת מכולה">🔄 החלפת מכולה</option>
        <option value="הוצאת מכולה">🚚 הוצאת מכולה</option>
    </select>
    <input type="text" id="address" placeholder="כתובת לאספקה / הצבה">
    <textarea id="orderDetails" rows="3" placeholder="פירוט ההזמנה (למשל: 5 בלות חול, 20 שקי מלט...)"></textarea>
    <button onclick="sendOrder()">
        <span>שלח הזמנה לווטסאפ</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
    </button>
</div>

</body>
</html>
