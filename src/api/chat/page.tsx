import { uploadToGoogleDrive } from "@/lib/drive-upload";

// ... בתוך הקומפוננטה
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    
    try {
      // 1. מעלה לדרייב
      const result = await uploadToGoogleDrive(file);
      
      // 2. שומר את ההודעה עם הלינק ב-Firebase (הדאטה בייס של הצ'אט)
      await addDoc(collection(db, `chats/${clientId}/messages`), {
        text: "📎 נשלח קובץ",
        imageUrl: result.viewLink, // שומרים את הלינק לדרייב
        sender: "client",
        timestamp: new Date(),
        type: "image"
      });
      
    } catch (error) {
      alert("שגיאה בהעלאת הקובץ: " + error);
    }
  }
};