"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase"; 
import { Lock, Mail, ArrowRight, UserCheck, KeyRound, Loader2 } from "lucide-react";

export default function StaffLogin() {
  const router = useRouter();
  
  // מצבי התחברות
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // מצבי החלפת סיסמה
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [tempStaffId, setTempStaffId] = useState<string | null>(null); // שומר זמנית את ה-ID עד להחלפה

  const handleLogin = async () => {
    if (!email || !password) { alert("נא למלא אימייל וסיסמה"); return; }
    setIsLoading(true);

    try {
        // חיפוש העובד לפי אימייל
        const q = query(collection(db, "staff"), where("email", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("משתמש לא נמצא. וודא שנרשמת אצל המנהל.");
            setIsLoading(false);
            return;
        }

        // בדיקת סיסמה
        const staffDoc = querySnapshot.docs[0];
        const staffData = staffDoc.data();

        if (staffData.password !== password) {
            alert("סיסמה שגויה");
            setIsLoading(false);
            return;
        }

        // בדיקה: האם זו כניסה ראשונה?
        if (staffData.isFirstLogin) {
            setTempStaffId(staffDoc.id); // שומר את ה-ID להמשך
            setShowChangePassword(true); // פותח את המודל להחלפה
            setIsLoading(false);
            return;
        }

        // התחברות מוצלחת (רגילה)
        completeLogin(staffDoc.id, staffData);

    } catch (error) {
        console.error("Login error:", error);
        alert("שגיאת התחברות");
        setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
      if (newPassword.length < 4) { alert("סיסמה חייבת להכיל לפחות 4 תווים"); return; }
      if (!tempStaffId) return;

      setIsLoading(true);
      try {
          // עדכון הסיסמה וביטול דגל "כניסה ראשונה"
          await updateDoc(doc(db, "staff", tempStaffId), {
              password: newPassword,
              isFirstLogin: false
          });

          alert("הסיסמה שונתה בהצלחה! מתחבר...");
          
          // משיכת הנתונים המעודכנים וכניסה
          // (בפועל אפשר פשוט להיכנס, הנתונים כבר שמורים לנו בזיכרון אבל נעשה זאת נקי)
          localStorage.setItem("saban_staff_auth", "true");
          localStorage.setItem("saban_staff_id", tempStaffId);
          // עדכון הנתונים בלוקל סטורג' עם הסיסמה החדשה (לא קריטי, אבל מסודר)
          // אנחנו פשוט נעביר לדשבורד
          router.push("/staff/dashboard");

      } catch (error) {
          console.error("Update password error:", error);
          alert("שגיאה בשינוי הסיסמה");
          setIsLoading(false);
      }
  };

  const completeLogin = (id: string, data: any) => {
      localStorage.setItem("saban_staff_auth", "true");
      localStorage.setItem("saban_staff_id", id);
      localStorage.setItem("saban_staff_data", JSON.stringify(data));
      router.push("/staff/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efeae2] p-4 font-sans" dir="rtl">
      
      {/* כרטיס התחברות */}
      {!showChangePassword ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-[#008069]">
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#008069]">
                    <UserCheck size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">כניסת צוות סבן</h1>
                <p className="text-gray-500 text-sm mt-1">ניהול הזמנות ולוגיסטיקה</p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <Mail className="absolute top-3 right-3 text-gray-400" size={20}/>
                    <input 
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#008069] focus:ring-1 focus:ring-[#008069] outline-none transition"
                        placeholder="אימייל ארגוני"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute top-3 right-3 text-gray-400" size={20}/>
                    <input 
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#008069] focus:ring-1 focus:ring-[#008069] outline-none transition"
                        placeholder="סיסמה"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>

                <button 
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-[#008069] hover:bg-[#006a57] text-white p-3 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin"/> : <ArrowRight size={20}/>}
                    {isLoading ? "מתחבר..." : "התחבר למערכת"}
                </button>
            </div>
            
            <div className="mt-6 text-center text-xs text-gray-400">
                &copy; 2025 מערכות ח. סבן
            </div>
          </div>
      ) : (
          /* כרטיס החלפת סיסמה (מופיע רק בכניסה ראשונה) */
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-orange-500 animate-in zoom-in-95 duration-300">
              <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                      <KeyRound size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">ברוך הבא לצוות!</h2>
                  <p className="text-gray-600 text-sm mt-2">זו הכניסה הראשונה שלך.<br/>אנא בחר סיסמה חדשה ואישית.</p>
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">סיסמה חדשה:</label>
                      <input 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                          placeholder="הקלד סיסמה חדשה..."
                          type="password"
                          autoFocus
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                      />
                  </div>

                  <button 
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg font-bold shadow transition-all"
                  >
                      {isLoading ? "מעדכן..." : "שמור סיסמה והכנס"}
                  </button>
              </div>
          </div>
      )}

    </div>
  );
}