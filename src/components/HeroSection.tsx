import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface HeroSectionProps {
  onScrollToInput: () => void;
}

const HeroSection = ({ onScrollToInput }: HeroSectionProps) => {
  return (
    <section className="relative flex min-h-[75vh] flex-col items-center justify-center px-4 pt-20 pb-12 text-center overflow-hidden">
      {/* Fire background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame-orange/8 blur-[150px] flame-flicker" />
        <div className="absolute left-1/3 top-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-flame-red/6 blur-[100px] flame-flicker" style={{ animationDelay: "1s" }} />
        <div className="absolute right-1/4 top-1/3 h-[200px] w-[200px] rounded-full bg-flame-yellow/5 blur-[80px] flame-flicker" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 max-w-3xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-flame-orange/20 bg-flame-orange/5 px-4 py-1.5">
          <Flame className="h-3.5 w-3.5 text-flame-orange" strokeWidth={2} />
          <span className="text-xs font-semibold tracking-wide text-flame-orange">AI-Powered Website Roasting</span>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ letterSpacing: "-0.03em" }}>
          Roast Your Website{" "}
          <span className="fire-gradient-text">
            with AI
          </span>{" "}
          🔥
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground sm:text-lg" style={{ textWrap: "pretty" }}>
          Get brutally honest feedback and fix your website instantly. No signup required.
        </p>

        <motion.button
          onClick={onScrollToInput}
          whileHover={{ scale: 1.04, boxShadow: "0 0 30px hsla(24, 100%, 50%, 0.5)" }}
          whileTap={{ scale: 0.97 }}
          className="fire-gradient rounded-xl px-10 py-4 text-base font-bold text-white transition-all heat-pulse"
        >
          🔥 Start Roasting
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
