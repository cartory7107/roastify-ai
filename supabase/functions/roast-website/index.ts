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
    const { url, industry = 'general', language = 'en' } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ error: 'Firecrawl not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI gateway not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 1: Scrape the website with Firecrawl
    console.log('Scraping URL:', url);
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html', 'links'],
        onlyMainContent: false,
        waitFor: 3000,
      }),
    });

    if (!scrapeResponse.ok) {
      const errText = await scrapeResponse.text();
      console.error('Firecrawl error:', scrapeResponse.status, errText);
      if (scrapeResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Firecrawl credits exhausted. Please top up your Firecrawl plan.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: `Failed to scrape website: ${scrapeResponse.status}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const scrapeData = await scrapeResponse.json();
    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    const html = scrapeData.data?.html || scrapeData.html || '';
    const links = scrapeData.data?.links || scrapeData.links || [];
    const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};

    // Extract key signals from HTML for the AI
    const htmlLower = html.toLowerCase();
    const signals = {
      title: metadata.title || '',
      description: metadata.description || '',
      hasViewportMeta: htmlLower.includes('viewport'),
      hasMetaDescription: htmlLower.includes('meta') && htmlLower.includes('description'),
      hasOgTags: htmlLower.includes('og:'),
      h1Count: (html.match(/<h1/gi) || []).length,
      h2Count: (html.match(/<h2/gi) || []).length,
      imgCount: (html.match(/<img/gi) || []).length,
      imgWithAlt: (html.match(/<img[^>]+alt\s*=\s*"[^"]+"/gi) || []).length,
      linkCount: links.length,
      hasStructuredData: htmlLower.includes('application/ld+json'),
      hasFavicon: htmlLower.includes('favicon') || htmlLower.includes('icon'),
      formCount: (html.match(/<form/gi) || []).length,
      buttonCount: (html.match(/<button/gi) || []).length,
      ctaKeywords: (html.match(/sign\s*up|get\s*started|try\s*free|buy\s*now|subscribe|contact\s*us|learn\s*more/gi) || []).length,
      contentLength: markdown.length,
    };

    console.log('Signals extracted:', JSON.stringify(signals));

    // Step 2: Send to AI for roast analysis
    const systemPrompt = `You are "Roastify AI", a brutally honest but helpful website critic. You analyze websites and provide scores, roast feedback, and actionable improvement tips.

You MUST respond using the suggest_roast tool. Do not respond with plain text.

Analyze the website based on the provided content and signals. Be specific about what you see. Reference actual elements from the page. Be savage but constructive.

Scoring guidelines:
- Design (0-100): Visual hierarchy, typography, whitespace, color usage, modern feel
- SEO (0-100): Meta tags, headings structure, alt text, structured data, URL structure
- Speed (0-100): Content optimization signals, image count, code bloat indicators
- Conversion (0-100): CTAs, forms, social proof, value proposition clarity

For roast items, find 4-8 real issues. Each should reference something specific from the actual page content.
For quick wins, provide 5-8 actionable tips specific to this website.`;

    const userPrompt = `Analyze this website: ${url}

Page title: ${signals.title}
Meta description: ${signals.description || 'MISSING'}

Key signals:
- H1 tags: ${signals.h1Count}, H2 tags: ${signals.h2Count}
- Images: ${signals.imgCount} (${signals.imgWithAlt} with alt text)
- Links: ${signals.linkCount}
- Forms: ${signals.formCount}, Buttons: ${signals.buttonCount}
- CTA keywords found: ${signals.ctaKeywords}
- Has viewport meta: ${signals.hasViewportMeta}
- Has OG tags: ${signals.hasOgTags}
- Has structured data (JSON-LD): ${signals.hasStructuredData}
- Has favicon: ${signals.hasFavicon}
- Content length: ${signals.contentLength} chars

Page content (first 3000 chars):
${markdown.slice(0, 3000)}`;

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
            name: 'suggest_roast',
            description: 'Return the website roast analysis with scores, issues, and tips.',
            parameters: {
              type: 'object',
              properties: {
                scores: {
                  type: 'object',
                  properties: {
                    design: { type: 'number', description: 'Design score 0-100' },
                    seo: { type: 'number', description: 'SEO score 0-100' },
                    speed: { type: 'number', description: 'Speed score 0-100' },
                    conversion: { type: 'number', description: 'Conversion score 0-100' },
                  },
                  required: ['design', 'seo', 'speed', 'conversion'],
                  additionalProperties: false,
                },
                roastItems: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string', description: 'Short problem title' },
                      problem: { type: 'string', description: 'Brutally honest description of the problem' },
                      fix: { type: 'string', description: 'Actionable fix suggestion' },
                    },
                    required: ['title', 'problem', 'fix'],
                    additionalProperties: false,
                  },
                },
                quickWins: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of 5-8 quick actionable improvement tips',
                },
              },
              required: ['scores', 'roastItems', 'quickWins'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'suggest_roast' } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited. Please try again in a moment.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits in Settings.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'AI analysis failed' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    // Extract tool call result
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error('No tool call in AI response:', JSON.stringify(aiData));
      return new Response(JSON.stringify({ error: 'AI returned unexpected format' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const roastResult = JSON.parse(toolCall.function.arguments);

    // Clamp scores to 0-100
    roastResult.scores.design = Math.max(0, Math.min(100, roastResult.scores.design));
    roastResult.scores.seo = Math.max(0, Math.min(100, roastResult.scores.seo));
    roastResult.scores.speed = Math.max(0, Math.min(100, roastResult.scores.speed));
    roastResult.scores.conversion = Math.max(0, Math.min(100, roastResult.scores.conversion));

    return new Response(JSON.stringify(roastResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('roast-website error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
