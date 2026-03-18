import { motion } from "framer-motion";
import { BarChart3, FileText, Search, ArrowRight, Lock } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface FeatureShowcaseProps {
  onScrollToInput: () => void;
}

const FeatureShowcase = ({ onScrollToInput }: FeatureShowcaseProps) => {
  const { t } = useLanguage();

  const examples = [
    {
      icon: BarChart3,
      title: t("showcase.competitor.title"),
      badge: t("showcase.competitor.badge"),
      color: "flame-orange",
      colorHsl: "var(--flame-orange)",
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">yoursite.com</span>
            <span className="text-muted-foreground">vs</span>
            <span className="text-muted-foreground">competitor.com</span>
          </div>
          {[
            { label: t("scores.design"), yours: 62, theirs: 84 },
            { label: t("scores.seo"), yours: 45, theirs: 78 },
            { label: t("scores.conversion"), yours: 38, theirs: 71 },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-foreground">
                <span>{item.label}</span>
                <span className="text-flame-orange">{item.yours} vs {item.theirs}</span>
              </div>
              <div className="flex gap-1.5 h-2">
                <div className="flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-flame-orange/70" style={{ width: `${item.yours}%` }} />
                </div>
                <div className="flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-success/70" style={{ width: `${item.theirs}%` }} />
                </div>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-flame-orange font-medium pt-1">
            ⚠ {t("showcase.competitor.verdict")}
          </p>
        </div>
      ),
    },
    {
      icon: FileText,
      title: t("showcase.brief.title"),
      badge: t("showcase.brief.badge"),
      color: "fire-red",
      colorHsl: "var(--fire-red)",
      content: (
        <div className="space-y-3">
          <div className="rounded-lg bg-muted/20 px-3 py-2.5 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-fire-red">{t("showcase.brief.problem")}</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{t("showcase.brief.problemText")}</p>
          </div>
          <div className="rounded-lg bg-success/5 px-3 py-2.5 space-y-2" style={{ border: "1px solid hsl(152 60% 45% / 0.15)" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-success">{t("showcase.brief.solution")}</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{t("showcase.brief.solutionText")}</p>
          </div>
          <div className="rounded-lg bg-flame-orange/5 px-3 py-2.5 space-y-1.5" style={{ border: "1px solid hsl(var(--flame-orange) / 0.15)" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-flame-orange">{t("showcase.brief.prompt")}</div>
            <p className="text-[11px] text-foreground font-mono leading-relaxed">{t("showcase.brief.promptText")}</p>
          </div>
        </div>
      ),
    },
    {
      icon: Search,
      title: t("showcase.seo.title"),
      badge: t("showcase.seo.badge"),
      color: "flame-yellow",
      colorHsl: "var(--flame-yellow)",
      content: (
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("showcase.seo.missing")}
          </div>
          {["restaurant near me", "best food delivery", "online menu order"].map((kw) => (
            <div key={kw} className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
              <span className="text-xs text-foreground font-medium">"{kw}"</span>
              <span className="text-[10px] text-fire-red font-semibold">{t("showcase.seo.notfound")}</span>
            </div>
          ))}
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-3 mb-2">
            {t("showcase.seo.suggestions")}
          </div>
          {["local restaurant deals", "fast food near me"].map((kw) => (
            <div key={kw} className="flex items-center justify-between rounded-lg bg-success/5 px-3 py-2" style={{ border: "1px solid hsl(152 60% 45% / 0.15)" }}>
              <span className="text-xs text-foreground font-medium">+ "{kw}"</span>
              <span className="text-[10px] text-success font-semibold">{t("showcase.seo.add")}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase"
          style={{ background: "linear-gradient(135deg, hsl(var(--flame-orange) / 0.12), hsl(var(--fire-red) / 0.12))", color: "hsl(var(--flame-orange))" }}>
          {t("showcase.badge")}
        </div>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t("showcase.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">{t("showcase.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {examples.map((ex, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl glass-surface p-5 flex flex-col"
            style={{ boxShadow: `inset 0 0 0 1px hsl(${ex.colorHsl} / 0.2), 0 4px 24px rgba(0,0,0,0.2)` }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${ex.color}/10`}>
                <ex.icon className={`h-4 w-4 text-${ex.color}`} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{ex.title}</h3>
                <span className="text-[10px] text-muted-foreground">{ex.badge}</span>
              </div>
            </div>

            {/* Content preview */}
            <div className="flex-1 mb-4">{ex.content}</div>

            {/* Locked overlay hint */}
            <div className="flex items-center gap-1.5 justify-center rounded-lg bg-muted/10 py-2 text-[10px] text-muted-foreground">
              <Lock className="h-3 w-3" />
              {t("showcase.example")}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 40px hsl(var(--flame-orange) / 0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onScrollToInput}
          className="inline-flex items-center gap-2 fire-gradient rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg"
        >
          {t("showcase.cta")} <ArrowRight className="h-4 w-4" />
        </motion.button>
        <p className="mt-3 text-xs text-muted-foreground">{t("showcase.ctaHint")}</p>
      </motion.div>
    </section>
  );
};

export default FeatureShowcase;
