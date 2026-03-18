import { motion } from "framer-motion";
import { Lock, Flame, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const PaywallSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Premium $7 */}
        <div className="rounded-2xl glass-surface p-8 flex flex-col items-center text-center"
          style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 0 30px hsla(24, 100%, 50%, 0.15)" }}
        >
          <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-flame-orange/10">
            <Lock className="h-5 w-5 text-flame-orange" strokeWidth={1.5} />
          </div>
          <h3 className="mb-2 text-lg font-bold text-foreground">{t("paywall.title")}</h3>
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed">{t("paywall.desc")}</p>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsla(24, 100%, 50%, 0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 w-full fire-gradient rounded-xl px-5 py-3 text-sm font-bold text-white"
          >
            <Flame className="h-4 w-4" /> {t("paywall.unlock")} — $7
          </motion.button>
        </div>

        {/* Pro $15 */}
        <div className="rounded-2xl glass-surface p-8 flex flex-col items-center text-center"
          style={{ boxShadow: "inset 0 0 0 1px hsla(152, 60%, 45%, 0.3), 0 0 30px hsla(152, 60%, 45%, 0.1)" }}
        >
          <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <Rocket className="h-5 w-5 text-success" strokeWidth={1.5} />
          </div>
          <h3 className="mb-2 text-lg font-bold text-foreground">{t("paywall.pro.title")}</h3>
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed">{t("paywall.pro.desc")}</p>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsla(152, 60%, 45%, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 w-full rounded-xl px-5 py-3 text-sm font-bold text-white bg-success hover:bg-success/90 transition-colors"
          >
            <Rocket className="h-4 w-4" /> {t("paywall.pro.title")} — $15
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default PaywallSection;
