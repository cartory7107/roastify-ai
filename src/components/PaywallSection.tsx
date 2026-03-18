import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";

const PaywallSection = () => {
  return (
    <section className="relative mx-auto max-w-3xl px-4 py-16">
      {/* Blurred preview */}
      <div className="relative overflow-hidden rounded-2xl glass-surface p-8">
        <div className="pointer-events-none select-none blur-sm opacity-40 space-y-3">
          <p className="font-mono text-xs text-foreground">▸ Advanced keyword density analysis...</p>
          <p className="font-mono text-xs text-foreground">▸ Schema markup recommendations...</p>
          <p className="font-mono text-xs text-foreground">▸ Conversion funnel optimization...</p>
          <p className="font-mono text-xs text-foreground">▸ Competitor gap analysis...</p>
          <p className="font-mono text-xs text-foreground">▸ Technical SEO deep-dive...</p>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 paywall-blur flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-surface rounded-2xl p-8 text-center max-w-sm"
          >
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Unlock the Full Roast</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Get advanced SEO tips, conversion strategy insights, and a complete technical audit.
            </p>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" /> Unlock Full Roast — $7
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PaywallSection;
