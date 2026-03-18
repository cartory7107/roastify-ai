import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Loader2 } from "lucide-react";

interface URLInputSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  scanLogs: string[];
}

const URLInputSection = forwardRef<HTMLDivElement, URLInputSectionProps>(
  ({ onSubmit, isLoading, scanLogs }, ref) => {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = url.trim();
      if (!trimmed) {
        setError("Please enter a URL");
        return;
      }
      try {
        const testUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
        new URL(testUrl);
        setError("");
        onSubmit(testUrl);
      } catch {
        setError("Invalid domain. Try again.");
      }
    };

    return (
      <section ref={ref} className="relative mx-auto max-w-2xl px-4 py-16">
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={`relative flex items-center gap-3 rounded-2xl p-2 transition-all glass-surface ${
              error ? "ring-2 ring-destructive/50" : "focus-within:ring-2 focus-within:ring-flame-orange/40"
            }`}
          >
            <Flame className="ml-3 h-5 w-5 shrink-0 text-flame-orange/60" strokeWidth={1.5} />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="https://example.com"
              className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 20px hsla(24, 100%, 50%, 0.4)" } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="flex items-center gap-2 fire-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning
                </>
              ) : (
                "Roast My Website 🔥"
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-2 pl-2 text-xs text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        {/* Scan Terminal */}
        <AnimatePresence>
          {isLoading && scanLogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-xl glass-surface p-4"
              style={{ boxShadow: "inset 0 0 0 1px var(--stroke-fire), 0 0 20px hsla(24, 100%, 50%, 0.1)" }}
            >
              <div className="relative overflow-hidden">
                <div className="scan-line absolute inset-x-0 top-0 z-10" />
                {scanLogs.map((log, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="font-mono text-xs text-flame-orange/80"
                  >
                    🔥 {log}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  }
);

URLInputSection.displayName = "URLInputSection";

export default URLInputSection;
