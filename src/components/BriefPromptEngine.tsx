import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, Wand2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BriefPromptEngineProps {
  url: string;
  roastSummary: string;
  industry?: string;
}

const BriefPromptEngine = ({ url, roastSummary, industry }: BriefPromptEngineProps) => {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("brief-prompt", {
        body: { url, roastSummary, industry, language },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPrompt(data.prompt);
      setSummary(data.shortSummary || "");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success(t("export.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase"
            style={{ background: "linear-gradient(135deg, hsl(var(--flame-orange) / 0.15), hsl(var(--fire-red) / 0.15))", color: "hsl(var(--flame-orange))" }}>
            <Sparkles className="h-3.5 w-3.5" />
            {t("prompt.badge")}
          </div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            {t("prompt.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            {t("prompt.subtitle")}
          </p>
        </div>

        {/* Generate button or result */}
        {!prompt ? (
          <div className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={generatePrompt}
              disabled={isGenerating}
              className="fire-gradient rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-60 flex items-center gap-2"
              style={{ boxShadow: "0 0 30px hsl(var(--flame-orange) / 0.3)" }}
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? t("prompt.generating") : t("prompt.button")}
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary badge */}
            {summary && (
              <div className="text-center text-xs text-muted-foreground italic">
                {summary}
              </div>
            )}

            {/* Prompt display */}
            <div
              className="relative rounded-xl p-5 glass-surface text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono"
              style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 4px 24px rgba(0,0,0,0.3)" }}
            >
              {prompt}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={copyPrompt}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold text-white fire-gradient"
                style={{ boxShadow: "0 0 20px hsl(var(--flame-orange) / 0.25)" }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t("export.copied") : t("prompt.copy")}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={generatePrompt}
                disabled={isGenerating}
                className="flex items-center gap-2 rounded-lg glass-surface px-5 py-2.5 text-xs font-semibold text-foreground disabled:opacity-60"
                style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}
              >
                <Wand2 className="h-3.5 w-3.5 text-flame-orange" />
                {t("prompt.regenerate")}
              </motion.button>
            </div>

            {/* Helper text */}
            <p className="text-center text-[11px] text-muted-foreground">
              {t("prompt.helper")}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default BriefPromptEngine;
