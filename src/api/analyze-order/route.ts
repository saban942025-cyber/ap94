import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { text } = await req.json();

  const prompt = `
    אתה מנהל הזמנות בחנות חומרי בניין.
    תנתח את הטקסט הבא ותחזיר JSON בלבד של רשימת מוצרים.
    אם אין מוצרים, תחזיר מערך ריק.
    טקסט: "${text}"
    פורמט רצוי: [{ "product": "שם מוצר", "quantity": מספר, "unit": "יחידה/בלה/משטח" }]
  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o-mini", // דגם מהיר וזול
  });

  const result = completion.choices[0].message.content;
  return NextResponse.json({ order: JSON.parse(result || "[]") });
}