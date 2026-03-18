import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface QuickWinsProps {
  tips: string[];
}

const QuickWins = ({ tips }: QuickWinsProps) => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {t("quickwins.title")}
      </h2>
      <div className="glass-surface rounded-2xl p-6" style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle), 0 0 20px hsla(152, 60%, 45%, 0.06)" }}>
        <ul className="space-y-3">
          {tips.map((tip, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2} />
              <span className="text-sm text-foreground/80">{tip}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
};

export default QuickWins;
