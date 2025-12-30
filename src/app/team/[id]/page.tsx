"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function TeamLogin() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const login = async () => {
        const staffId = params.id as string;
        if (!staffId) return;

        // בדיקה שהעובד קיים במערכת
        try {
            const docRef = doc(db, "staff", staffId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // שמירת זהות העובד + אישור כניסה כללי
                localStorage.setItem("saban_staff_auth", "true"); // הרשאה כללית
                localStorage.setItem("saban_staff_id", staffId); // זהות ספציפית
                localStorage.setItem("saban_staff_data", JSON.stringify(docSnap.data())); // שמירת פרטים לשימוש מהיר
                
                router.push("/staff/dashboard");
            } else {
                alert("קוד עובד לא נמצא במערכת");
                router.push("/staff/login");
            }
        } catch (error) {
            console.error("Login error", error);
        }
    };
    login();
  }, [params, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <h1 className="text-xl font-bold">מזהה איש צוות ומתחבר...</h1>
    </div>
  );
}