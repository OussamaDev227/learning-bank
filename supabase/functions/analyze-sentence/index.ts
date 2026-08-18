// Supabase Edge Function: real-time Arabic إعراب (grammatical parsing) via
// the Gemini free-tier API. The API key stays server-side as a secret —
// never shipped to the browser.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent'

const SYSTEM_PROMPT = `أنت خبير في النحو العربي. مهمتك إعراب الجملة العربية التي يزودك بها المستخدم، كلمة كلمة.
أرجع النتيجة بصيغة JSON فقط، على شكل مصفوفة من عناصر، كل عنصر يمثل كلمة من الجملة بهذا الشكل بالضبط:
{"word": "الكلمة كما وردت في الجملة", "role": "نوعها النحوي المختصر (مثل: فعل ماضٍ، فاعل، مفعول به، حرف جر...)", "explanation": "الإعراب الكامل والمفصل لهذه الكلمة"}
لا تكتب أي نص خارج مصفوفة الـ JSON. حافظ على ترتيب الكلمات كما وردت في الجملة الأصلية.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sentence } = await req.json()

    if (!sentence || typeof sentence !== 'string' || !sentence.trim()) {
      return new Response(JSON.stringify({ error: 'يرجى إدخال جملة صحيحة' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'لم يتم إعداد مفتاح الذكاء الاصطناعي بعد' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nالجملة: "${sentence.trim()}"` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    })

    if (!geminiRes.ok) {
      const detail = await geminiRes.text()
      return new Response(JSON.stringify({ error: 'تعذّر الاتصال بمحرك التحليل', detail }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const geminiData = await geminiRes.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return new Response(JSON.stringify({ error: 'لم يتمكن المحرك من تحليل الجملة' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const words = JSON.parse(text)

    return new Response(JSON.stringify({ words }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'حدث خطأ غير متوقع', detail: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
