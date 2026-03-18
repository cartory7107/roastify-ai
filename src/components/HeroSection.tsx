import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface HeroSectionProps {
  onScrollToInput: () => void;
}

const HeroSection = ({ onScrollToInput }: HeroSectionProps) => {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 pb-12 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 max-w-3xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
          <span className="text-xs font-medium tracking-wide text-primary">AI-Powered Website Analysis</span>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]" style={{ textWrap: "balance", letterSpacing: "-0.04em" }}>
          Roast Your Website{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            with AI
          </span>{" "}
          in Seconds
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-sm text-muted-foreground sm:text-base" style={{ textWrap: "pretty" }}>
          Get brutally honest feedback and improve your website performance instantly. No signup required.
        </p>

        <motion.button
          onClick={onScrollToInput}
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors"
        >
          Start Roasting
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
