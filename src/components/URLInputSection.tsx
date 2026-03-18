import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export type Industry = "general" | "restaurant" | "ecommerce" | "agency" | "personal";

interface URLInputSectionProps {
  onSubmit: (url: string, industry: Industry, competitorUrl?: string) => void;
  isLoading: boolean;
  scanLogs: string[];
}

const URLInputSection = forwardRef<HTMLDivElement, URLInputSectionProps>(
  ({ onSubmit, isLoading, scanLogs }, ref) => {
    const { t } = useLanguage();
    const [url, setUrl] = useState("");
    const [competitorUrl, setCompetitorUrl] = useState("");
    const [industry, setIndustry] = useState<Industry>("general");
    const [error, setError] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);

    const industries: { value: Industry; labelKey: string }[] = [
      { value: "general", labelKey: "General" },
      { value: "restaurant", labelKey: "industry.restaurant" },
      { value: "ecommerce", labelKey: "industry.ecommerce" },
      { value: "agency", labelKey: "industry.agency" },
      { value: "personal", labelKey: "industry.personal" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = url.trim();
      if (!trimmed) {
        setError(t("input.error.empty"));
        return;
      }
      try {
        const testUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
        new URL(testUrl);
        setError("");
        const compUrl = competitorUrl.trim();
        let validCompUrl: string | undefined;
        if (compUrl) {
          const fullComp = compUrl.startsWith("http") ? compUrl : `https://${compUrl}`;
          try {
            new URL(fullComp);
            validCompUrl = fullComp;
          } catch {
            // ignore invalid competitor URL
          }
        }
        onSubmit(testUrl, industry, validCompUrl);
      } catch {
        setError(t("input.error.invalid"));
      }
    };

    return (
      <section ref={ref} className="relative mx-auto max-w-2xl px-4 py-16">
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <div
            className={`relative flex items-center gap-3 rounded-2xl p-2 transition-all glass-surface ${
              error ? "ring-2 ring-destructive/50" : "focus-within:ring-2 focus-within:ring-flame-orange/40"
            }`}
          >
            <Flame className="ml-3 h-5 w-5 shrink-0 text-flame-orange/60" strokeWidth={1.5} />
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
              placeholder={t("input.placeholder")}
              className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 20px hsla(24, 100%, 50%, 0.4)" } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="flex items-center gap-2 fire-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />{t("input.scanning")}</>
              ) : (
                t("input.button")
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="pl-2 text-xs text-destructive">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Advanced options toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-muted-foreground hover:text-flame-orange transition-colors"
          >
            {showAdvanced ? "▾" : "▸"} {t("industry.label")} & {t("competitor.title").replace("🧠 ", "")}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {/* Industry selector */}
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind.value}
                      type="button"
                      onClick={() => setIndustry(ind.value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        industry === ind.value
                          ? "fire-gradient text-white"
                          : "glass-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {ind.value === "general" ? ind.labelKey : t(ind.labelKey)}
                    </button>
                  ))}
                </div>

                {/* Competitor URL */}
                <div className="flex items-center gap-3 rounded-xl p-2 glass-surface">
                  <input
                    type="text"
                    value={competitorUrl}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    placeholder={t("competitor.placeholder")}
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Scan Terminal */}
        <AnimatePresence>
          {isLoading && scanLogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-xl glass-surface p-4"
              style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 0 20px hsla(24, 100%, 50%, 0.1)" }}
            >
              <div className="relative overflow-hidden">
                <div className="scan-line absolute inset-x-0 top-0 z-10" />
                {scanLogs.map((log, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="font-mono text-xs text-flame-orange/80">
                    🔥 {log}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  }
);

URLInputSection.displayName = "URLInputSection";
export default URLInputSection;
