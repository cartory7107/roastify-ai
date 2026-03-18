import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, ExternalLink, ChevronDown, ChevronUp, Flame, Target } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Advantage {
  area: string;
  detail: string;
}

interface Competitor {
  name: string;
  url: string;
  overallScore: number;
  userScore: number;
  advantages: Advantage[];
}

interface TopCompetitorsProps {
  url: string;
  roastSummary: string;
  industry?: string;
}

const TopCompetitors = ({ url, roastSummary, industry }: TopCompetitorsProps) => {
  const { t, language } = useLanguage();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  const fetchCompetitors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("find-competitors", {
        body: { url, industry, roastSummary, language },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setCompetitors(data.competitors || []);
      setSummary(data.summary || "");
      setLoaded(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to find competitors");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (!loaded) fetchCompetitors();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-flame-orange";
    return "text-fire-red";
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        {/* Header */}
        <div className="mb-6 text-center">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase"
            style={{
              background: "linear-gradient(135deg, hsl(var(--flame-orange) / 0.15), hsl(var(--fire-red) / 0.15))",
              color: "hsl(var(--flame-orange))",
            }}
          >
            <Trophy className="h-3.5 w-3.5" />
            {t("topcomp.badge")}
          </div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t("topcomp.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">{t("topcomp.subtitle")}</p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-flame-orange border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">{t("topcomp.loading")}</p>
          </div>
        )}

        {/* Results */}
        {loaded && !isLoading && (
          <div className="space-y-4">
            {/* Summary */}
            {summary && (
              <div
                className="rounded-xl glass-surface px-5 py-3 text-sm text-muted-foreground text-center italic"
                style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}
              >
                {summary}
              </div>
            )}

            {/* Competitor cards */}
            {competitors.map((comp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl glass-surface overflow-hidden"
                style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 4px 20px rgba(0,0,0,0.2)" }}
              >
                {/* Card header - always visible */}
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--surface-glass-hover)]"
                >
                  {/* Rank */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full fire-gradient text-sm font-bold text-white">
                    #{i + 1}
                  </div>

                  {/* Name + URL */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground truncate">{comp.name}</h3>
                      <a
                        href={comp.url.startsWith("http") ? comp.url : `https://${comp.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-flame-orange hover:text-flame-yellow transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{comp.url}</p>
                  </div>

                  {/* Score comparison */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">{t("topcomp.you")}</p>
                      <p className={`text-lg font-bold ${getScoreColor(comp.userScore)}`}>{comp.userScore}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">{t("topcomp.them")}</p>
                      <p className={`text-lg font-bold ${getScoreColor(comp.overallScore)}`}>{comp.overallScore}</p>
                    </div>
                  </div>

                  {/* Expand icon */}
                  {expanded === i ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Expanded advantages */}
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-[hsl(var(--border))] px-5 py-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-flame-orange mb-3 flex items-center gap-1.5">
                      <Target className="h-3 w-3" />
                      {t("topcomp.whatBetter")}
                    </p>
                    <div className="space-y-3">
                      {comp.advantages.map((adv, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-flame-orange/10">
                            <Flame className="h-3 w-3 text-flame-orange" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground">{adv.area}</span>
                            <p className="text-xs text-muted-foreground leading-relaxed">{adv.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {competitors.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">{t("topcomp.none")}</p>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default TopCompetitors;
