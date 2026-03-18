import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, FileDown } from "lucide-react";

interface ExportSectionProps {
  reportText: string;
}

const ExportSection = ({ reportText }: ExportSectionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roast-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3 px-4 py-8"
    >
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px hsla(24, 100%, 50%, 0.3)" }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 rounded-xl glass-surface px-6 py-3 text-sm font-semibold text-foreground transition-all"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span key="check" initial={{ scale: 0.8 }} animate={{ scale: 1.1 }} exit={{ scale: 0.8 }} className="flex items-center gap-2 text-success">
              <Check className="h-4 w-4" /> Copied!
            </motion.span>
          ) : (
            <motion.span key="copy" className="flex items-center gap-2">
              <Copy className="h-4 w-4" strokeWidth={1.5} /> Copy Report
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.button
        onClick={handleDownload}
        whileHover={{ scale: 1.03, boxShadow: "0 0 20px hsla(24, 100%, 50%, 0.3)" }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 rounded-xl glass-surface px-6 py-3 text-sm font-semibold text-foreground transition-all"
      >
        <FileDown className="h-4 w-4" strokeWidth={1.5} /> Download Report
      </motion.button>
    </motion.section>
  );
};

export default ExportSection;
