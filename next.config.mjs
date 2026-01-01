/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // <--- זה הפקודה הקריטית! מייצר תיקיית "out"
  images: {
    unoptimized: true, // חובה ב-Static Export (אחרת תמונות ישברו)
  },
  eslint: {
    ignoreDuringBuilds: true, // מונע עצירה בגלל שגיאות קטנות
  },
};

export default nextConfig;
