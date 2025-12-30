"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { Send, Plus, Minus, Package, X, ShoppingCart, Paperclip, MapPin, Image as ImageIcon, FileText, Loader2, Eye } from "lucide-react"; 

const GAS_URL = "https://script.google.com/macros/s/AKfycbwcZTdSI7o4cYfGlsD7bquYKBseGLSMUVilE9PA_xd3Txml8lVD3IPCRWuhLZ933wI/exec";

const PRODUCTS = [
  { key: "חול", name: "חול (בלה)", sku: "80010" },
  { key: "סומסום", name: "סומסום (בלה)", sku: "80020" },
  { key: "טיט", name: "טיט (בלה)", sku: "80030" },
  { key: "מלט", name: "מלט (שק)", sku: "10055" },
  { key: "חצץ", name: "חצץ (בלה)", sku: "80040" },
  { key: "טיח", name: "טיח גבס", sku: "20010" },
  { key: "בלוקים", name: "משטח בלוקים", sku: "50090" },
  { key: "גבס", name: "לוחות גבס", sku: "30040" },
];

interface OrderItem { name: string; quantity: number; sku: string; }
interface Message { id: string; text: string; sender: "client" | "server"; timestamp: Timestamp; type: "text" | "image" | "file" | "location"; fileUrl?: string; location?: {lat: number, lng: number} }

export default function ChatPage() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [draftOrder, setDraftOrder] = useState<OrderItem[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // סטייט לתצוגת PDF
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = localStorage.getItem("saban_client_id");
    if (!id) { window.location.href = "/"; return; }
    setClientId(id);
    const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!msg.trim()) return;
    const items: OrderItem[] = [];
    PRODUCTS.forEach(prod => {
      const regex = new RegExp(`(\\d+)\\s*(?:בלות|שקים|משטחים|יחידות|לוחות)?\\s*${prod.key}`);
      const match = msg.match(regex);
      if (match) {
        const existing = draftOrder.find(i => i.sku === prod.sku);
        if (existing) items.push(existing);
        else items.push({ name: prod.name, quantity: parseInt(match[1]), sku: prod.sku });
      }
    });
    if (items.length > 0 && items.length !== draftOrder.length) setDraftOrder(items);
  }, [msg]);

  const updateQty = (index: number, delta: number) => {
    const updated = [...draftOrder]; updated[index].quantity = Math.max(1, updated[index].quantity + delta); setDraftOrder(updated);
  };

  const handleSend = async (type: "text" | "image" | "file" | "location" = "text", content: any = null) => {
    if (!clientId) return;
    const messageData: any = { sender: "client", timestamp: new Date(), type: type, text: msg };

    if (type === "text") {
        if (draftOrder.length > 0) {
            const summary = draftOrder.map(i => `${i.quantity} ${i.name}`).join(", ");
            messageData.text = `⭐ הזמנה חדשה: ${summary}`;
        } else if (!msg.trim()) return;
    } 
    else if (type === "image" || type === "file") {
        messageData.text = type === "image" ? "📷 תמונה מצורפת" : "📄 קובץ מצורף";
        messageData.fileUrl = content;
    } 
    else if (type === "location") {
        messageData.text = "📍 מיקום לשילוח";
        messageData.location = content;
    }

    try {
        await addDoc(collection(db, `chats/${clientId}/messages`), messageData);
        if (type === "text") { setMsg(""); setDraftOrder([]); }
        setShowAttachMenu(false);
    } catch (error) { console.error(error); alert("שגיאה בשליחה"); }
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { alert("קובץ גדול מדי"); return; }
    
    setIsUploading(true);
    try {
        const base64File = await toBase64(file);
        const response = await fetch(GAS_URL, {
            redirect: "follow",
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ file: base64File, filename: file.name, mimeType: file.type })
        });
        const data = await response.json();
        if (data.status === "success") {
            const type = file.type.startsWith("image/") ? "image" : "file";
            await handleSend(type, data.url);
        } else { throw new Error(data.message || "Server Error"); }
    } catch (err) { console.error(err); alert("שגיאה בהעלאה"); } finally { setIsUploading(false); }
  };

  const handleLocation = () => {
      if (!navigator.geolocation) { alert("אין תמיכה במיקום"); return; }
      setIsUploading(true); 
      navigator.geolocation.getCurrentPosition(
          (pos) => { handleSend("location", { lat: pos.coords.latitude, lng: pos.coords.longitude }); setIsUploading(false); },
          (err) => { alert("לא ניתן לאתר מיקום"); setIsUploading(false); }
      );
  };

  return (
    <div className="flex flex-col h-screen bg-[#efeae2]">
      {/* Header */}
      <div className="bg-[#008069] p-3 text-white flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold border border-white/30 text-white">ח.ס</div>
            <div className="flex flex-col">
                <span className="font-bold text-white text-lg">הזמנות ח. סבן</span>
                <span className="text-xs text-green-100 font-medium">מחובר</span>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-100">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[85%] p-3 rounded-lg text-sm shadow-md relative ${m.sender === 'client' ? 'bg-[#d9fdd3] self-end rounded-tr-none' : 'bg-white self-start rounded-tl-none'}`} dir="auto">
            
            {m.type === 'text' && <span className="text-gray-900 font-medium text-base">{m.text}</span>}
            
            {/* תמונה: הוספנו referrerPolicy כדי לעקוף חסימות גוגל */}
            {m.type === 'image' && m.fileUrl && (
                <div>
                    <img 
                        src={m.fileUrl} 
                        alt="תמונה" 
                        referrerPolicy="no-referrer"
                        className="rounded-lg max-h-60 w-full object-cover bg-gray-200 min-h-[100px]"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    {/* גיבוי למקרה שהתמונה נשברת */}
                    <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 mt-1 block underline">פתח תמונה בחלון חדש</a>
                </div>
            )}

            {/* קובץ PDF/מסמך - עיצוב כרטיס */}
            {m.type === 'file' && m.fileUrl && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded border border-gray-300">
                        <div className="bg-red-100 p-2 rounded-full"><FileText className="text-red-600" size={24}/></div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-gray-800 truncate">מסמך מצורף</span>
                            <span className="text-xs text-gray-500">PDF / DOCX</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                         {/* כפתור פתיחה רגיל */}
                        <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-200 text-gray-700 p-2 rounded text-center font-bold text-xs hover:bg-gray-300">
                            הורדה
                        </a>
                        {/* כפתור הצגה מהירה (Preview) */}
                        <button onClick={() => setPreviewPdf(m.fileUrl!)} className="flex-1 bg-blue-100 text-blue-700 p-2 rounded text-center font-bold text-xs hover:bg-blue-200 flex items-center justify-center gap-1">
                            <Eye size={14}/> הצגה
                        </button>
                    </div>
                </div>
            )}

            {m.type === 'location' && m.location && (
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-gray-800 flex items-center gap-1"><MapPin size={16}/> מיקום נשלח</span>
                    <a href={`https://waze.com/ul?ll=${m.location.lat},${m.location.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow font-bold text-center hover:bg-blue-600">🚗 נווט ב-Waze</a>
                </div>
            )}
            <div className="text-[10px] text-gray-500 text-end mt-1 font-medium">{m.timestamp?.seconds ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* מודל תצוגה מקדימה ל-PDF */}
      {previewPdf && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full h-[80%] rounded-lg flex flex-col relative">
                <button onClick={() => setPreviewPdf(null)} className="absolute -top-10 right-0 text-white p-2"><X size={32}/></button>
                <iframe src={previewPdf} className="w-full h-full rounded-b-lg" title="PDF Preview"></iframe>
                <div className="p-2 bg-gray-100 text-center font-bold rounded-t-lg border-b">תצוגה מקדימה</div>
            </div>
        </div>
      )}

      {/* אזור הקלדה */}
      <div className="bg-[#f0f2f5] p-3 flex items-center gap-3 pb-5 md:pb-3 border-t border-gray-300 relative z-30">
        {showAttachMenu && (
            <div className="absolute bottom-20 right-4 flex flex-col gap-3 animate-in slide-in-from-bottom-5 bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 z-50">
                <button onClick={handleLocation} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors w-full">
                    <div className="bg-green-100 text-green-600 p-2 rounded-full"><MapPin size={20}/></div>
                    <span className="font-bold text-gray-700">שלח מיקום</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors w-full">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-full"><ImageIcon size={20}/></div>
                    <span className="font-bold text-gray-700">תמונה/מסמך</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.doc,.docx" />
            </div>
        )}
        <button onClick={() => setShowAttachMenu(!showAttachMenu)} className={`p-3 rounded-full transition-all shadow-sm border border-gray-200 ${showAttachMenu ? 'bg-gray-300 text-gray-800 rotate-45' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Paperclip size={22} strokeWidth={2.5} />
        </button>
        <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend('text')} className="flex-1 bg-white p-4 rounded-2xl outline-none text-right border border-gray-300 focus:border-green-500 font-medium text-base text-gray-900" placeholder="הקלד הזמנה..." dir="auto"/>
        <button onClick={() => handleSend('text')} disabled={isUploading} className={`p-4 rounded-full text-white transition-all shadow-lg flex items-center justify-center ${draftOrder.length > 0 ? 'bg-orange-600 w-auto px-6' : 'bg-[#008069] w-14'}`}>
            {isUploading ? <Loader2 className="animate-spin" size={24} /> : (draftOrder.length > 0 ? <><span className="font-bold ml-2">שלח</span><Package size={20}/></> : <Send size={24} />)}
        </button>
      </div>
    </div>
  );
}