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
    const { url, industry = 'general', roastSummary = '', language = 'en', userScores } = await req.json();

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

    // Pass user's ACTUAL scores so the AI uses them as the anchor
    const userScoreStr = userScores
      ? `The analyzed website's ACTUAL scores (already computed, DO NOT change these):
  - Design: ${userScores.design}/100
  - SEO: ${userScores.seo}/100
  - Speed: ${userScores.speed}/100
  - Conversion: ${userScores.conversion}/100
  - Total: ${Math.round((userScores.design + userScores.seo + userScores.speed + userScores.conversion) / 4)}/100`
      : '';

    const systemPrompt = `You are a deterministic competitive analysis engine. You MUST follow these rules strictly:

CRITICAL RULES:
1. CONSISTENCY: The user's website scores are FIXED and provided to you. Do NOT re-score the user's site. Use the exact scores given.
2. OBJECTIVITY: Score each competitor on the EXACT SAME 4 categories (design, seo, speed, conversion) using 0-100 scale.
3. NO CONTRADICTIONS: If Competitor X scores higher than User's site, then when User's site is compared to Competitor X later, the relative ranking MUST remain the same.
4. DATA-DRIVEN: Every advantage must reference specific, measurable factors (e.g., "faster load time", "proper heading hierarchy", "mobile-first responsive design"). Never use vague statements like "looks better" or "feels nicer".
5. DETERMINISTIC: Given the same two websites, always produce the same relative scoring. Base scores on well-known public facts about these websites.

Respond in ${targetLang}. Use the find_competitors tool.

For each competitor:
- Use a REAL, well-known website URL
- Score them on ALL 4 categories (design, seo, speed, conversion) individually
- Explain specifically what they do better with measurable/specific details
- Also note where the USER's site is better (if applicable)

SCORING GUIDELINES:
- Major platforms (Google, YouTube, Amazon) generally score 80-95 on most categories
- Mid-tier known sites score 60-80
- Small/unknown sites score 30-60
- Be realistic and consistent with publicly known information`;

    const userPrompt = `Website: ${url}
Industry: ${industry}
${userScoreStr}
Known issues: ${roastSummary || 'General analysis needed'}

Find 2-3 real competitor websites. Score each on the SAME 4 categories. Be consistent and data-driven.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        temperature: 0.1, // Low temperature for consistency
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'find_competitors',
            description: 'Return competitor analysis with scores on the same 4 categories as the user site.',
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
                      scores: {
                        type: 'object',
                        description: 'Scores on the same 4 categories',
                        properties: {
                          design: { type: 'number', description: 'Design score 0-100' },
                          seo: { type: 'number', description: 'SEO score 0-100' },
                          speed: { type: 'number', description: 'Speed score 0-100' },
                          conversion: { type: 'number', description: 'Conversion score 0-100' },
                        },
                        required: ['design', 'seo', 'speed', 'conversion'],
                        additionalProperties: false,
                      },
                      advantages: {
                        type: 'array',
                        description: 'Specific areas where this competitor is better than the user site',
                        items: {
                          type: 'object',
                          properties: {
                            area: { type: 'string', description: 'Category name: Design, SEO, Speed, or Conversion' },
                            detail: { type: 'string', description: 'Specific, measurable explanation' },
                          },
                          required: ['area', 'detail'],
                          additionalProperties: false,
                        },
                      },
                      userAdvantages: {
                        type: 'array',
                        description: 'Areas where the USER site is better than this competitor (can be empty)',
                        items: {
                          type: 'object',
                          properties: {
                            area: { type: 'string' },
                            detail: { type: 'string' },
                          },
                          required: ['area', 'detail'],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ['name', 'url', 'scores', 'advantages', 'userAdvantages'],
                    additionalProperties: false,
                  },
                },
                verdict: { type: 'string', description: 'One-line balanced verdict summarizing the competitive landscape with specific reasons' },
              },
              required: ['competitors', 'verdict'],
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

    // Inject user's actual scores into the response for the frontend
    if (userScores) {
      result.userScores = userScores;
    }

    // Compute total scores server-side for consistency
    result.competitors = (result.competitors || []).map((comp: any) => {
      const s = comp.scores || {};
      comp.totalScore = Math.round((s.design + s.seo + s.speed + s.conversion) / 4);
      return comp;
    });

    if (userScores) {
      result.userTotalScore = Math.round(
        (userScores.design + userScores.seo + userScores.speed + userScores.conversion) / 4
      );
    }

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
