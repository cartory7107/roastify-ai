import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGES, useLanguage, type Language } from "@/lib/i18n";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language)!;

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg glass-surface px-3 py-2 text-xs font-medium text-foreground transition-all hover:bg-[var(--surface-glass-hover)]"
      >
        <Globe className="h-3.5 w-3.5 text-flame-orange" />
        <span>{current.flag} {current.label}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 min-w-[140px] overflow-hidden rounded-xl glass-surface"
            style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 8px 32px rgba(0,0,0,0.5)" }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all hover:bg-[var(--surface-glass-hover)] ${
                  lang.code === language ? "text-flame-orange" : "text-foreground"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
