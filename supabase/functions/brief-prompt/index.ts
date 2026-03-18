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
    const { url, roastSummary, industry = 'general', language = 'en' } = await req.json();

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

    const targetLang = langMap[language] || "English";

    const systemPrompt = `You are a website improvement expert. Generate a ready-to-use AI prompt that users can copy and paste into AI website builders, coding assistants, or design tools to fix their website. Write ENTIRELY in ${targetLang}.

You MUST respond using the generate_brief_prompt tool.

The prompt should be structured, clear, and actionable. It must contain:
1. Context about the website
2. Listed problems found
3. Specific fix requirements
4. Clear step-by-step instructions for AI/developer

Make the prompt professional and comprehensive so any AI tool can understand and execute it.`;

    const userPrompt = `Website: ${url}
Industry: ${industry}
Issues found: ${roastSummary}

Generate a comprehensive AI fix prompt in ${targetLang}.`;

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
            name: 'generate_brief_prompt',
            description: 'Return a structured AI fix prompt.',
            parameters: {
              type: 'object',
              properties: {
                prompt: { type: 'string', description: 'The full ready-to-use AI fix prompt' },
                shortSummary: { type: 'string', description: 'A one-line summary of what the prompt fixes' },
              },
              required: ['prompt', 'shortSummary'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'generate_brief_prompt' } },
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
    console.error('brief-prompt error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
