// Supabase Edge Function powering three "أدوات المنصة" tools that share the
// same Gemini free-tier setup as analyze-sentence: تحليل النصوص (analyze),
// التشكيل والتدقيق (proofread), ترجمة النصوص (translate). Consolidated into
// one function to minimize dashboard redeploys.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent'

type Tool = 'analyze' | 'proofread' | 'translate'

function buildPrompt(tool: Tool, text: string, targetLanguage?: string): string {
  switch (tool) {
    case 'analyze':
      return `أنت خبير لغوي. حلّل النص العربي التالي وأرجع النتيجة بصيغة JSON فقط، بهذا الشكل بالضبط:
{"summary": "ملخص موجز للفكرة الرئيسية في جملتين أو ثلاث", "themes": ["موضوع رئيسي 1", "موضوع رئيسي 2"], "style": "وصف أسلوب الكاتب ونوع النص", "tone": "نبرة النص (رسمية، عاطفية، سردية، إلخ)"}

النص:
"${text}"`

    case 'proofread':
      return `أنت مدقق لغوي عربي خبير. للنص التالي:
1) أضف التشكيل الكامل (الحركات الإعرابية) على كل كلمة.
2) صحّح أي أخطاء إملائية أو نحوية ووضّح كل خطأ.
أرجع النتيجة بصيغة JSON فقط، بهذا الشكل بالضبط:
{"diacritized": "النص كاملاً مع التشكيل", "errors": [{"original": "الكلمة أو العبارة الخاطئة", "correction": "التصحيح الصحيح", "explanation": "سبب الخطأ بإيجاز"}]}
إذا لم توجد أي أخطاء أرجع "errors" كمصفوفة فارغة [].

النص:
"${text}"`

    case 'translate':
      return `ترجم النص العربي التالي إلى اللغة "${targetLanguage}" ترجمة دقيقة وسليمة تحافظ على المعنى والأسلوب. أرجع النتيجة بصيغة JSON فقط، بهذا الشكل بالضبط:
{"translation": "النص مترجماً بالكامل"}

النص:
"${text}"`
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tool, text, targetLanguage } = await req.json()

    if (!text || typeof text !== 'string' || !text.trim()) {
      return new Response(JSON.stringify({ error: 'يرجى إدخال نص صحيح' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!['analyze', 'proofread', 'translate'].includes(tool)) {
      return new Response(JSON.stringify({ error: 'أداة غير معروفة' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (tool === 'translate' && !targetLanguage) {
      return new Response(JSON.stringify({ error: 'يرجى اختيار لغة الترجمة' }), {
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

    const prompt = buildPrompt(tool as Tool, text.trim(), targetLanguage)

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      return new Response(JSON.stringify({ error: 'لم يتمكن المحرك من معالجة النص' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const result = JSON.parse(responseText)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'حدث خطأ غير متوقع', detail: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
