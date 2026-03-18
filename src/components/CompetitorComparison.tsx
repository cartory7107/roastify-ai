import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

interface CompetitorComparisonProps {
  yourScores: { design: number; seo: number; speed: number; conversion: number };
  competitorScores: { design: number; seo: number; speed: number; conversion: number };
  competitorUrl: string;
}

const CompetitorComparison = ({ yourScores, competitorScores, competitorUrl }: CompetitorComparisonProps) => {
  const { t } = useLanguage();
  const categories = [
    { key: "design" as const, label: t("scores.design") },
    { key: "seo" as const, label: t("scores.seo") },
    { key: "speed" as const, label: t("scores.speed") },
    { key: "conversion" as const, label: t("scores.conversion") },
  ];

  const betterCategories = categories.filter((c) => competitorScores[c.key] > yourScores[c.key]);
  const yourBetter = categories.filter((c) => yourScores[c.key] >= competitorScores[c.key]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {t("competitor.title")}
      </h2>

      <div className="glass-surface rounded-2xl p-6 space-y-6" style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire)" }}>
        {/* Score bars */}
        {categories.map((cat) => {
          const yours = yourScores[cat.key];
          const theirs = competitorScores[cat.key];
          return (
            <div key={cat.key}>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-semibold text-foreground">{cat.label}</span>
                <span className="text-xs text-muted-foreground">
                  You: {yours} vs {theirs}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${yours}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full fire-gradient"
                  />
                </div>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${theirs}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-muted-foreground/50"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Summary */}
        {betterCategories.length > 0 && (
          <div className="rounded-lg bg-flame-red/5 p-3 ring-1 ring-flame-red/20">
            <p className="text-xs text-flame-red">
              <span className="font-bold">⚠ {t("competitor.better")}:</span>{" "}
              {betterCategories.map((c) => c.label).join(", ")}
            </p>
          </div>
        )}
        {yourBetter.length > 0 && (
          <div className="rounded-lg bg-success/5 p-3 ring-1 ring-success/20">
            <p className="text-xs text-success">
              <span className="font-bold">✔ {t("competitor.yours")}:</span>{" "}
              {yourBetter.map((c) => c.label).join(", ")}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default CompetitorComparison;
