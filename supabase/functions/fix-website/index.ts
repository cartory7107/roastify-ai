import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, roastSummary, language = "en" } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const langMap: Record<string, string> = {
      en: "English", bn: "Bangla", es: "Spanish", fr: "French", de: "German",
      it: "Italian", pt: "Portuguese", hi: "Hindi", ur: "Urdu",
      zh: "Chinese (Simplified)", ja: "Japanese", ko: "Korean",
      ar: "Arabic", tr: "Turkish", ru: "Russian", nl: "Dutch",
    };

    const systemPrompt = `You are a website improvement expert. Based on a website roast analysis, generate specific, actionable fixes. Respond in ${langMap[language] || "English"}.

You MUST respond using the suggest_fixes tool.`;

    const userPrompt = `Website: ${url}
Issues found: ${roastSummary}

Generate specific improvements: a new headline, CTA text, recommended section structure, and layout suggestions.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'suggest_fixes',
            description: 'Return website fix suggestions.',
            parameters: {
              type: 'object',
              properties: {
                headline: { type: 'string', description: 'Improved headline for the website' },
                ctaText: { type: 'string', description: 'Improved CTA button text' },
                sectionStructure: { type: 'array', items: { type: 'string' }, description: 'Recommended page section order' },
                layoutSuggestions: { type: 'array', items: { type: 'string' }, description: 'Layout improvement tips' },
              },
              required: ['headline', 'ctaText', 'sectionStructure', 'layoutSuggestions'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'suggest_fixes' } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (status === 402) return new Response(JSON.stringify({ error: 'Credits exhausted' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify({ error: 'AI failed' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: 'Unexpected AI response' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('fix-website error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
