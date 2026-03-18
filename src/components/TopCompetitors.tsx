import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, ExternalLink, ChevronDown, ChevronUp, Flame, Crown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Advantage {
  area: string;
  detail: string;
}

interface CompetitorScores {
  design: number;
  seo: number;
  speed: number;
  conversion: number;
}

interface Competitor {
  name: string;
  url: string;
  scores: CompetitorScores;
  totalScore: number;
  advantages: Advantage[];
  userAdvantages: Advantage[];
}

interface TopCompetitorsProps {
  url: string;
  roastSummary: string;
  industry?: string;
  userScores: { design: number; seo: number; speed: number; conversion: number };
}

const CATEGORIES = ["design", "seo", "speed", "conversion"] as const;

const TopCompetitors = ({ url, roastSummary, industry, userScores }: TopCompetitorsProps) => {
  const { t, language } = useLanguage();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [verdict, setVerdict] = useState("");
  const [userTotalScore, setUserTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  const fetchCompetitors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("find-competitors", {
        body: { url, industry, roastSummary, language, userScores },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setCompetitors(data.competitors || []);
      setVerdict(data.verdict || "");
      setUserTotalScore(data.userTotalScore || Math.round(
        (userScores.design + userScores.seo + userScores.speed + userScores.conversion) / 4
      ));
      setLoaded(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to find competitors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loaded) fetchCompetitors();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-flame-orange";
    return "text-fire-red";
  };

  const getComparisonIcon = (userVal: number, compVal: number) => {
    if (userVal > compVal) return <TrendingUp className="h-3 w-3 text-success" />;
    if (userVal < compVal) return <TrendingDown className="h-3 w-3 text-fire-red" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      design: t("scores.design"),
      seo: t("scores.seo"),
      speed: t("scores.speed"),
      conversion: t("scores.conversion"),
    };
    return map[cat] || cat;
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

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-flame-orange border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">{t("topcomp.loading")}</p>
          </div>
        )}

        {/* Results */}
        {loaded && !isLoading && (
          <div className="space-y-4">
            {/* Verdict */}
            {verdict && (
              <div
                className="rounded-xl glass-surface px-5 py-3 text-sm text-muted-foreground text-center italic"
                style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}
              >
                {verdict}
              </div>
            )}

            {/* Competitor Cards */}
            {competitors.map((comp, i) => {
              const isWinner = comp.totalScore > userTotalScore;
              const isTie = comp.totalScore === userTotalScore;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl glass-surface overflow-hidden"
                  style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 4px 20px rgba(0,0,0,0.2)" }}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--surface-glass-hover)]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full fire-gradient text-sm font-bold text-white">
                      #{i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground truncate">{comp.name}</h3>
                        {isWinner && <Crown className="h-3.5 w-3.5 text-flame-orange" />}
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

                    {/* Winner Badge */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase">{t("topcomp.you")}</p>
                        <p className={`text-lg font-bold ${getScoreColor(userTotalScore)}`}>{userTotalScore}</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-bold">vs</span>
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase">{t("topcomp.them")}</p>
                        <p className={`text-lg font-bold ${getScoreColor(comp.totalScore)}`}>{comp.totalScore}</p>
                      </div>
                    </div>

                    {expanded === i ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {/* Expanded Details */}
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="border-t border-[hsl(var(--border))] px-5 py-4 space-y-5"
                    >
                      {/* Winner Declaration */}
                      <div
                        className={`rounded-lg px-4 py-3 text-center text-sm font-bold ${
                          isWinner
                            ? "bg-fire-red/10 text-fire-red ring-1 ring-fire-red/20"
                            : isTie
                              ? "bg-flame-orange/10 text-flame-orange ring-1 ring-flame-orange/20"
                              : "bg-success/10 text-success ring-1 ring-success/20"
                        }`}
                      >
                        {isWinner
                          ? `🏆 ${t("topcomp.winner")}: ${comp.name} (${comp.totalScore} vs ${userTotalScore})`
                          : isTie
                            ? `⚖️ ${t("topcomp.tie")} (${comp.totalScore})`
                            : `✔ ${t("topcomp.youWin")} (${userTotalScore} vs ${comp.totalScore})`}
                      </div>

                      {/* Category-by-Category Comparison */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                          {t("topcomp.categoryBreakdown")}
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {CATEGORIES.map((cat) => {
                            const yours = userScores[cat];
                            const theirs = comp.scores[cat];
                            const youWin = yours >= theirs;
                            return (
                              <div
                                key={cat}
                                className={`rounded-lg p-3 text-center ring-1 ${
                                  youWin
                                    ? "bg-success/5 ring-success/20"
                                    : "bg-fire-red/5 ring-fire-red/20"
                                }`}
                              >
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                                  {getCategoryLabel(cat)}
                                </p>
                                <div className="flex items-center justify-center gap-1.5">
                                  <span className={`text-sm font-bold ${getScoreColor(yours)}`}>{yours}</span>
                                  {getComparisonIcon(yours, theirs)}
                                  <span className={`text-sm font-bold ${getScoreColor(theirs)}`}>{theirs}</span>
                                </div>
                                <p className={`text-[9px] font-semibold mt-0.5 ${youWin ? "text-success" : "text-fire-red"}`}>
                                  {youWin ? `✔ ${t("topcomp.you")}` : `✘ ${comp.name}`}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Their Advantages */}
                      {comp.advantages.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-fire-red mb-2 flex items-center gap-1.5">
                            <Flame className="h-3 w-3" />
                            {t("topcomp.whatBetter")}
                          </p>
                          <div className="space-y-2">
                            {comp.advantages.map((adv, j) => (
                              <div key={j} className="flex items-start gap-3 rounded-lg bg-fire-red/5 p-3 ring-1 ring-fire-red/10">
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-fire-red/10">
                                  <TrendingDown className="h-3 w-3 text-fire-red" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-foreground">{adv.area}</span>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{adv.detail}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Your Advantages */}
                      {comp.userAdvantages && comp.userAdvantages.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-success mb-2 flex items-center gap-1.5">
                            <TrendingUp className="h-3 w-3" />
                            {t("topcomp.yourStrengths")}
                          </p>
                          <div className="space-y-2">
                            {comp.userAdvantages.map((adv, j) => (
                              <div key={j} className="flex items-start gap-3 rounded-lg bg-success/5 p-3 ring-1 ring-success/10">
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-success/10">
                                  <TrendingUp className="h-3 w-3 text-success" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-foreground">{adv.area}</span>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{adv.detail}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

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
