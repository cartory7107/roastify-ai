import { motion } from "framer-motion";
import { Lock, Flame, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const PaywallSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Premium $7 */}
        <div className="relative overflow-hidden rounded-2xl glass-surface p-8">
          <div className="pointer-events-none select-none blur-sm opacity-40 space-y-3">
            <p className="font-mono text-xs text-foreground">🔥 Advanced keyword density analysis...</p>
            <p className="font-mono text-xs text-foreground">🔥 Schema markup recommendations...</p>
            <p className="font-mono text-xs text-foreground">🔥 Conversion funnel optimization...</p>
          </div>
          <div className="absolute inset-0 paywall-blur flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-surface rounded-2xl p-6 text-center max-w-xs"
              style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 0 30px hsla(24, 100%, 50%, 0.15)" }}
            >
              <div className="mb-3 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-flame-orange/10">
                <Lock className="h-4 w-4 text-flame-orange" strokeWidth={1.5} />
              </div>
              <h3 className="mb-1.5 text-base font-bold text-foreground">{t("paywall.title")}</h3>
              <p className="mb-4 text-xs text-muted-foreground">{t("paywall.desc")}</p>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsla(24, 100%, 50%, 0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full fire-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              >
                <Flame className="h-4 w-4" /> {t("paywall.unlock")} — $7
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Pro $15 */}
        <div className="relative overflow-hidden rounded-2xl glass-surface p-8">
          <div className="pointer-events-none select-none blur-sm opacity-40 space-y-3">
            <p className="font-mono text-xs text-foreground">🧠 Competitor gap analysis...</p>
            <p className="font-mono text-xs text-foreground">🖼️ Screenshot deep scan...</p>
            <p className="font-mono text-xs text-foreground">📊 SEO keyword boost report...</p>
          </div>
          <div className="absolute inset-0 paywall-blur flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-surface rounded-2xl p-6 text-center max-w-xs"
              style={{ boxShadow: "inset 0 0 0 1px hsla(152, 60%, 45%, 0.3), 0 0 30px hsla(152, 60%, 45%, 0.1)" }}
            >
              <div className="mb-3 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <Rocket className="h-4 w-4 text-success" strokeWidth={1.5} />
              </div>
              <h3 className="mb-1.5 text-base font-bold text-foreground">{t("paywall.pro.title")}</h3>
              <p className="mb-4 text-xs text-muted-foreground">{t("paywall.pro.desc")}</p>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsla(152, 60%, 45%, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-success hover:bg-success/90 transition-colors"
              >
                <Rocket className="h-4 w-4" /> {t("paywall.pro.title")} — $15
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaywallSection;
