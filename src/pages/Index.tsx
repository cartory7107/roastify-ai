import { useState, useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import URLInputSection from "@/components/URLInputSection";
import type { Industry } from "@/components/URLInputSection";
import ScoreDashboard from "@/components/ScoreDashboard";
import RoastReport from "@/components/RoastReport";
import QuickWins from "@/components/QuickWins";
import ExportSection from "@/components/ExportSection";
import PaywallSection from "@/components/PaywallSection";
import FooterSection from "@/components/FooterSection";
import FixGenerator from "@/components/FixGenerator";
import CompetitorComparison from "@/components/CompetitorComparison";
import BriefPromptEngine from "@/components/BriefPromptEngine";
import AIChat from "@/components/AIChat";
import { generateReportText, getScanMessages, type RoastResult } from "@/lib/mockRoast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { toast } from "sonner";

const Index = () => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const [competitorResult, setCompetitorResult] = useState<RoastResult | null>(null);
  const [competitorUrl, setCompetitorUrl] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  const scrollToInput = useCallback(() => {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleSubmit = useCallback(async (url: string, industry: Industry, compUrl?: string) => {
    setIsLoading(true);
    setResult(null);
    setCompetitorResult(null);
    setScanLogs([]);
    setAnalyzedUrl(url);
    setCompetitorUrl(compUrl || "");

    const messages = getScanMessages();
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < messages.length) {
        setScanLogs((prev) => [...prev, messages[logIndex]]);
        logIndex++;
      }
    }, 600);

    try {
      // Main analysis
      const { data, error } = await supabase.functions.invoke('roast-website', {
        body: { url, industry, language },
      });

      clearInterval(logInterval);

      if (error) {
        toast.error(error.message || 'Failed to analyze website.');
        setIsLoading(false);
        setScanLogs([]);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setIsLoading(false);
        setScanLogs([]);
        return;
      }

      setResult(data as RoastResult);

      // Competitor analysis if URL provided
      if (compUrl) {
        try {
          const { data: compData } = await supabase.functions.invoke('roast-website', {
            body: { url: compUrl, industry, language },
          });
          if (compData && !compData.error) {
            setCompetitorResult(compData as RoastResult);
          }
        } catch {
          // Competitor analysis is optional, don't block
        }
      }
    } catch (err) {
      clearInterval(logInterval);
      console.error('Roast error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setScanLogs([]);
    }
  }, [language]);

  const reportText = result ? generateReportText(analyzedUrl, result) : "";
  const roastSummary = result
    ? result.roastItems.map((r) => `${r.title}: ${r.problem}`).join("; ")
    : "";

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onScrollToInput={scrollToInput} />
      <URLInputSection ref={inputRef} onSubmit={handleSubmit} isLoading={isLoading} scanLogs={scanLogs} />

      {result && (
        <>
          <ScoreDashboard scores={result.scores} />
          <RoastReport items={result.roastItems} />

          {competitorResult && competitorUrl && (
            <CompetitorComparison
              yourScores={result.scores}
              competitorScores={competitorResult.scores}
              competitorUrl={competitorUrl}
            />
          )}

          <FixGenerator url={analyzedUrl} roastSummary={roastSummary} />
          <QuickWins tips={result.quickWins} />
          <ExportSection reportText={reportText} />
          <PaywallSection />
        </>
      )}

      {result && (
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="flex items-center justify-center rounded-xl glass-surface h-24 text-xs text-muted-foreground" style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}>
            Advertisement Space
          </div>
        </div>
      )}

      <FooterSection />

      <AIChat websiteUrl={analyzedUrl || undefined} roastSummary={roastSummary || undefined} />
    </div>
  );
};

export default Index;
