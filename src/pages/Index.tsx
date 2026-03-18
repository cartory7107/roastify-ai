import { useState, useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import URLInputSection from "@/components/URLInputSection";
import ScoreDashboard from "@/components/ScoreDashboard";
import RoastReport from "@/components/RoastReport";
import QuickWins from "@/components/QuickWins";
import ExportSection from "@/components/ExportSection";
import PaywallSection from "@/components/PaywallSection";
import FooterSection from "@/components/FooterSection";
import { generateReportText, getScanMessages, type RoastResult } from "@/lib/mockRoast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  const scrollToInput = useCallback(() => {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleSubmit = useCallback(async (url: string) => {
    setIsLoading(true);
    setResult(null);
    setScanLogs([]);
    setAnalyzedUrl(url);

    // Start scan log animation in parallel with real API call
    const messages = getScanMessages();
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < messages.length) {
        setScanLogs((prev) => [...prev, messages[logIndex]]);
        logIndex++;
      }
    }, 600);

    try {
      const { data, error } = await supabase.functions.invoke('roast-website', {
        body: { url },
      });

      clearInterval(logInterval);

      if (error) {
        console.error('Edge function error:', error);
        toast.error(error.message || 'Failed to analyze website. Please try again.');
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
    } catch (err) {
      clearInterval(logInterval);
      console.error('Roast error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setScanLogs([]);
    }
  }, []);

  const reportText = result ? generateReportText(analyzedUrl, result) : "";

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onScrollToInput={scrollToInput} />
      <URLInputSection ref={inputRef} onSubmit={handleSubmit} isLoading={isLoading} scanLogs={scanLogs} />

      {result && (
        <>
          <ScoreDashboard scores={result.scores} />
          <RoastReport items={result.roastItems} />
          <QuickWins tips={result.quickWins} />
          <ExportSection reportText={reportText} />
          <PaywallSection />
        </>
      )}

      {/* Ad space placeholder */}
      {result && (
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="flex items-center justify-center rounded-xl glass-surface h-24 text-xs text-muted-foreground" style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}>
            Advertisement Space
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
};

export default Index;
