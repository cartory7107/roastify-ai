import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGES, RTL_LANGUAGES, useLanguage, type Language } from "@/lib/i18n";
import { Globe, Search } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const current = LANGUAGES.find((l) => l.code === language)!;

  const filtered = LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(search.toLowerCase()) ||
      l.code.includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

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
            className="absolute right-0 top-full mt-2 z-50 w-[200px] overflow-hidden rounded-xl glass-surface"
            style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 8px 32px rgba(0,0,0,0.5)" }}
          >
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[hsl(var(--border))]">
              <Search className="h-3 w-3 text-muted-foreground shrink-0" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Language list */}
            <div className="max-h-[280px] overflow-y-auto scrollbar-thin">
              {filtered.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all hover:bg-[var(--surface-glass-hover)] ${
                    lang.code === language ? "text-flame-orange" : "text-foreground"
                  }`}
                  dir={RTL_LANGUAGES.includes(lang.code) ? "rtl" : "ltr"}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-3 text-xs text-muted-foreground text-center">
                  No languages found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
