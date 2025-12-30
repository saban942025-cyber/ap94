"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Send, MapPin, Image as ImageIcon, Box, Plus, Loader2 } from "lucide-react";

// --- ממשקים ---
interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    imageUrl?: string;
    stock: number;
}

interface Message {
    id: string;
    text: string;
    sender: "client" | "server";
    timestamp: any;
    type: "text" | "image" | "location";
    fileUrl?: string;
    staffName?: string;
    staffAvatar?: string;
}

export default function ClientChat({ params }: { params: { clientId: string } }) {
    const [clientName, setClientName] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    
    // 🔥 ניהול מלאי והשלמה אוטומטית ללקוח 🔥
    const [inventory, setInventory] = useState<Product[]>([]);
    const [suggestions, setSuggestions] = useState<Product[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. טעינת פרטי לקוח + הודעות
    useEffect(() => {
        const fetchClient = async () => {
            const docRef = doc(db, "clients", params.clientId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setClientName(docSnap.data().name);
        };
        fetchClient();

        const q = query(collection(db, `chats/${params.clientId}/messages`), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[]);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });
        return () => unsubscribe();
    }, [params.clientId]);

    // 2. טעינת המלאי (כדי שהלקוח יוכל לחפש)
    useEffect(() => {
        const q = query(collection(db, "inventory"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setInventory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
        });
        return () => unsubscribe();
    }, []);

    // --- לוגיקת השלמה אוטומטית ---
    const handleInputChange = (text: string) => {
        setNewMessage(text);

        // אם הטקסט קצר, הסתר הצעות
        if (text.length < 2) {
            setSuggestions([]);
            return;
        }

        // חיפוש חכם במלאי
        const matches = inventory.filter(p => 
            p.name.toLowerCase().includes(text.toLowerCase()) || 
            p.sku.includes(text)
        ).slice(0, 5); // מקסימום 5 תוצאות כדי לא להסתיר את המסך

        setSuggestions(matches);
    };

    const selectSuggestion = (product: Product) => {
        // הכנסת המוצר לתיבה עם כמות ברירת מחדל (10) כדי לעזור ל-AI
        setNewMessage(`10 ${product.name}`);
        setSuggestions([]);
        // הלקוח יכול כעת לשנות את המספר וללחוץ שלח
    };

    // --- שליחת הודעה ---
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        await addDoc(collection(db, `chats/${params.clientId}/messages`), {
            text: newMessage,
            sender: "client",
            timestamp: new Date(),
            type: "text"
        });
        setNewMessage("");
        setSuggestions([]); // ניקוי הצעות
    };

    return (
        <div className="flex flex-col h-screen bg-[#efeae2] font-sans" dir="rtl">
            
            {/* כותרת */}
            <div className="bg-[#008069] p-4 text-white shadow-md flex items-center gap-3 sticky top-0 z-20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {clientName ? clientName[0] : <Loader2 className="animate-spin"/>}
                </div>
                <div>
                    <div className="font-bold">{clientName || "טוען..."}</div>
                    <div className="text-xs text-green-100">סבן מערכות - הזמנות</div>
                </div>
            </div>

            {/* אזור הצ'אט */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-100">
                {messages.map((m) => (
                    <div key={m.id} className={`max-w-[80%] p-2 rounded-lg text-sm shadow-md relative ${m.sender === 'client' ? 'bg-[#d9fdd3] self-start rounded-tr-none' : 'bg-white self-end rounded-tl-none'}`}>
                        {/* שם השולח (אם זה איש צוות) */}
                        {m.sender === 'server' && (
                            <div className="text-[10px] text-orange-600 font-bold mb-1 flex items-center gap-1">
                                {m.staffAvatar && <img src={m.staffAvatar} className="w-4 h-4 rounded-full"/>}
                                {m.staffName || "נציג שירות"}
                            </div>
                        )}
                        
                        <div>{m.text}</div>
                        <div className="text-[9px] text-gray-400 mt-1 text-left">
                            {m.timestamp?.seconds ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* אזור ההקלדה */}
            <div className="bg-white p-3 shadow-lg relative">
                
                {/* 🔥 חלון ההצעות הצף ללקוח 🔥 */}
                {suggestions.length > 0 && (
                    <div className="absolute bottom-full left-2 right-2 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto animate-in slide-in-from-bottom-2">
                        <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500 font-bold border-b">מוצרים זמינים במלאי:</div>
                        {suggestions.map(prod => (
                            <div 
                                key={prod.id} 
                                onClick={() => selectSuggestion(prod)}
                                className="p-3 border-b last:border-0 hover:bg-green-50 active:bg-green-100 cursor-pointer flex items-center gap-3 transition-colors"
                            >
                                {prod.imageUrl ? <img src={prod.imageUrl} className="w-10 h-10 rounded-md object-cover border"/> : <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400"><Box size={16}/></div>}
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-gray-800">{prod.name}</div>
                                    <div className="text-xs text-gray-500">מק"ט: {prod.sku}</div>
                                </div>
                                <Plus size={18} className="text-[#008069]"/>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2 items-center">
                    <input 
                        value={newMessage}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-gray-100 p-3 rounded-full outline-none focus:ring-2 focus:ring-[#008069] transition-all"
                        placeholder="הקלד הזמנה (למשל: מלט...)"
                    />
                    <button 
                        onClick={handleSendMessage}
                        className="bg-[#008069] text-white p-3 rounded-full shadow-lg hover:bg-[#006a57] active:scale-95 transition-transform"
                    >
                        <Send size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
}