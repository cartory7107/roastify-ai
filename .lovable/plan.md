

## Plan: Connect Real AI-Powered Website Analysis

To make this tool actually work, we need to:

### 1. Set up Lovable Cloud backend
- Create a Supabase Edge Function that receives a URL
- Use a web scraping service (like Firecrawl or a simple fetch) to grab the target site's HTML, meta tags, and structure
- Send the scraped content to an LLM (OpenAI/Anthropic) with a prompt that generates real roast feedback, scores, and suggestions

### 2. Update the frontend
- Replace the `generateMockRoast()` call in `Index.tsx` with a fetch to the Edge Function
- Keep the scanning animation during the real API call
- Handle errors gracefully (site unreachable, rate limits, etc.)

### 3. Edge Function logic
- Fetch target URL's HTML (with timeout)
- Extract key signals: title, meta tags, heading structure, image count, CTA presence, viewport meta, etc.
- Send extracted data to an LLM with a structured prompt requesting JSON output matching the existing `RoastResult` interface
- Return the AI-generated scores, roast items, and quick wins

### What stays the same
- All UI components, animations, export functionality
- The `RoastResult` interface and data shape
- The scanning terminal animation (runs during real API call instead of fake delays)

