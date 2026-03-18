import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Rocket, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { toast } from "sonner";

interface FixGeneratorProps {
  url: string;
  roastSummary: string;
}

interface FixResult {
  headline: string;
  ctaText: string;
  sectionStructure: string[];
  layoutSuggestions: string[];
}

const FixGenerator = ({ url, roastSummary }: FixGeneratorProps) => {
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("fix-website", {
        body: { url, roastSummary, language },
      });
      if (error) {
        toast.error("Failed to generate fixes");
        return;
      }
      setResult(data as FixResult);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {t("fixgen.title")}
      </h2>

      {!result && (
        <div className="flex justify-center">
          <motion.button
            onClick={handleGenerate}
            disabled={isGenerating}
            whileHover={!isGenerating ? { scale: 1.04, boxShadow: "0 0 30px hsla(24, 100%, 50%, 0.5)" } : {}}
            whileTap={!isGenerating ? { scale: 0.97 } : {}}
            className="flex items-center gap-2 fire-gradient rounded-xl px-8 py-3.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {t("fixgen.generating")}</>
            ) : (
              <><Rocket className="h-4 w-4" /> {t("fixgen.button")}</>
            )}
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <FixCard icon="✨" label={t("fixgen.headline")} content={result.headline} />
            <FixCard icon="🎯" label={t("fixgen.cta")} content={result.ctaText} />
            <FixCard icon="📐" label={t("fixgen.structure")} items={result.sectionStructure} />
            <FixCard icon="🖼️" label={t("fixgen.layout")} items={result.layoutSuggestions} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

const FixCard = ({ icon, label, content, items }: { icon: string; label: string; content?: string; items?: string[] }) => (
  <div className="rounded-xl glass-surface p-5" style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}>
    <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-flame-orange/70">{icon} {label}</p>
    {content && <p className="text-sm text-foreground/90">{content}</p>}
    {items && (
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-flame-yellow" />
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FixGenerator;
