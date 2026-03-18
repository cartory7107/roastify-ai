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
    const { url, industry = 'general', roastSummary = '', language = 'en' } = await req.json();

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

    const systemPrompt = `You are a competitive analysis expert. Given a website URL and its industry, identify 2-3 REAL, well-known competitor websites in the same niche that are doing better. Respond in ${targetLang}.

You MUST respond using the find_competitors tool.

For each competitor:
- Use a real, well-known website URL that actually exists
- Explain specifically what they do better (design, SEO, UX, conversion, content, speed, branding)
- Give each competitor a score estimate (0-100) vs the user's site
- Be specific and actionable - reference real features/elements those competitors have

Be honest and helpful. The goal is to show the user who's winning in their space and WHY.`;

    const userPrompt = `Website: ${url}
Industry: ${industry}
Known issues: ${roastSummary || 'General analysis needed'}

Find 2-3 real competitor websites that are better than this site. Explain specifically what each competitor does better.`;

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
            name: 'find_competitors',
            description: 'Return competitor analysis with real competitor websites.',
            parameters: {
              type: 'object',
              properties: {
                competitors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: 'Competitor brand/website name' },
                      url: { type: 'string', description: 'Full competitor URL' },
                      overallScore: { type: 'number', description: 'Estimated overall score 0-100' },
                      userScore: { type: 'number', description: 'Estimated score of user site 0-100' },
                      advantages: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            area: { type: 'string', description: 'Area name like Design, SEO, Speed, UX, Conversion, Content' },
                            detail: { type: 'string', description: 'Specific explanation of what they do better' },
                          },
                          required: ['area', 'detail'],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ['name', 'url', 'overallScore', 'userScore', 'advantages'],
                    additionalProperties: false,
                  },
                },
                summary: { type: 'string', description: 'One-line summary of competitive landscape' },
              },
              required: ['competitors', 'summary'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'find_competitors' } },
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
    console.error('find-competitors error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
