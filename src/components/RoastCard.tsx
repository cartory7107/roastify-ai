import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface RoastCardProps {
  title: string;
  problem: string;
  fix: string;
  index: number;
}

const RoastCard = ({ title, problem, fix, index }: RoastCardProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, boxShadow: "0 0 30px hsla(6, 100%, 50%, 0.15)" }}
      className="group relative overflow-hidden rounded-xl"
      style={{ background: "var(--surface-glass)", boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 0 15px hsla(6, 100%, 50%, 0.08)" }}
    >
      {/* Side-by-side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Problem side */}
        <div className="relative p-5 border-b md:border-b-0 md:border-r border-border/30">
          <div className="absolute left-0 top-0 h-full w-[3px] fire-gradient" />
          <div className="flex items-start gap-3 pl-2">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-flame-red" strokeWidth={2} />
            <div className="flex-1">
              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-flame-red/60">{t("report.problem")}</p>
              <h4 className="mb-1.5 font-mono text-xs font-bold uppercase tracking-tight text-flame-orange">
                🔥 {title}
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">{problem}</p>
            </div>
          </div>
        </div>

        {/* Solution side */}
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center text-success text-sm">✔</div>
            <div className="flex-1">
              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-success/60">{t("report.solution")}</p>
              <div className="rounded-lg bg-success/5 p-3 ring-1 ring-success/20">
                <p className="text-sm leading-relaxed text-success">
                  <span className="font-bold">{t("report.fix")}:</span> {fix}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoastCard;
