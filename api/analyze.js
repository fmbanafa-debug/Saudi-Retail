// Vercel Serverless Function
// يوضع هذا الملف داخل مجلد باسم api في المجلد الرئيسي
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const MODEL_NAME = "gemini-flash-latest"; 
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API Key missing in Vercel settings.' });

  const { prompt } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { 
            parts: [{ text: "أنت خبير مالي في Banafa's Financials. حلل بيانات المتاجر بأسلوب مهني ومختصر بالعربية." }] 
          }
        }),
      }
    );

    const data = await response.json();
    if (response.status === 429) return res.status(429).json({ error: 'تم تجاوز الحد المجاني. حاول لاحقاً.' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في معالجة طلب الذكاء الاصطناعي.' });
  }
}
