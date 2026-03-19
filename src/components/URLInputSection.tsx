import { useState, forwardRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Loader2, AlertTriangle, Link as LinkIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export type Industry = "general" | "restaurant" | "ecommerce" | "agency" | "personal";

interface URLInputSectionProps {
  onSubmit: (url: string, industry: Industry, competitorUrl?: string) => void;
  isLoading: boolean;
  scanLogs: string[];
}

const URL_REGEX = /^https?:\/\/[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+/;
const DOMAIN_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+/;

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (DOMAIN_REGEX.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function validateUrl(raw: string): string | null {
  if (!raw.trim()) return "empty";
  const normalized = normalizeUrl(raw);
  try {
    const parsed = new URL(normalized);
    if (!URL_REGEX.test(normalized)) return "invalid";
    if (!parsed.hostname.includes(".")) return "invalid";
    return null; // valid
  } catch {
    return "invalid";
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  empty: "Website link is required to start analysis.",
  invalid: "Please enter a valid website URL (e.g., https://example.com)",
};

const URLInputSection = forwardRef<HTMLDivElement, URLInputSectionProps>(
  ({ onSubmit, isLoading, scanLogs }, ref) => {
    const { t } = useLanguage();
    const [url, setUrl] = useState("");
    const [competitorUrl, setCompetitorUrl] = useState("");
    const [industry, setIndustry] = useState<Industry>("general");
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const industries: { value: Industry; labelKey: string }[] = [
      { value: "general", labelKey: "General" },
      { value: "restaurant", labelKey: "industry.restaurant" },
      { value: "ecommerce", labelKey: "industry.ecommerce" },
      { value: "agency", labelKey: "industry.agency" },
      { value: "personal", labelKey: "industry.personal" },
    ];

    // Live validation after first interaction
    const liveError = useMemo(() => {
      if (!touched || !url.trim()) return "";
      const err = validateUrl(url);
      return err ? ERROR_MESSAGES[err] : "";
    }, [url, touched]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      const err = validateUrl(url);
      if (err) {
        setError(ERROR_MESSAGES[err]);
        return;
      }
      const normalized = normalizeUrl(url);
      setError("");

      const compUrl = competitorUrl.trim();
      let validCompUrl: string | undefined;
      if (compUrl) {
        const fullComp = normalizeUrl(compUrl);
        if (!validateUrl(compUrl)) {
          validCompUrl = fullComp;
        }
      }
      onSubmit(normalized, industry, validCompUrl);
    };

    const displayError = error || liveError;
    const hasError = !!displayError;

    return (
      <section ref={ref} className="relative mx-auto max-w-2xl px-4 py-8 sm:py-16">
        <form onSubmit={handleSubmit} className="relative space-y-3">
          <div
            className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 rounded-2xl p-2 sm:p-2 transition-all duration-300 glass-surface ${
              hasError
                ? "ring-2 ring-destructive/60 shadow-[0_0_20px_hsla(0,80%,50%,0.15)]"
                : "focus-within:ring-2 focus-within:ring-flame-orange/40 focus-within:shadow-[0_0_24px_hsla(24,100%,50%,0.15)]"
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Flame className="ml-2 sm:ml-3 h-5 w-5 shrink-0 text-flame-orange/60" strokeWidth={1.5} />
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                onBlur={() => setTouched(true)}
                placeholder={t("input.placeholder")}
                className="flex-1 min-w-0 bg-transparent py-3 text-sm sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                disabled={isLoading}
                aria-invalid={hasError}
                aria-describedby={hasError ? "url-error" : undefined}
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 20px hsla(24, 100%, 50%, 0.4)" } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="flex items-center justify-center gap-2 fire-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60 w-full sm:w-auto shrink-0 hover:brightness-110"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />{t("input.scanning")}</>
              ) : (
                t("input.button")
              )}
            </motion.button>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                id="url-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 pl-2"
              >
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                <p className="text-xs text-destructive font-medium">{displayError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper text */}
          {!hasError && (
            <div className="flex items-center gap-1.5 pl-2">
              <LinkIcon className="h-3 w-3 text-muted-foreground/50" />
              <p className="text-[11px] text-muted-foreground/60">Example: https://yourwebsite.com</p>
            </div>
          )}

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

                <div className="flex items-center gap-3 rounded-xl p-2 glass-surface">
                  <input
                    type="text"
                    value={competitorUrl}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    placeholder={t("competitor.placeholder")}
                    className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
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
              className="mt-4 overflow-hidden rounded-xl glass-surface p-3 sm:p-4"
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

