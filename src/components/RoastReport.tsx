import { motion } from "framer-motion";
import RoastCard from "./RoastCard";

export interface RoastItem {
  title: string;
  problem: string;
  fix: string;
}

interface RoastReportProps {
  items: RoastItem[];
}

const RoastReport = ({ items }: RoastReportProps) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        🔥 Roast Report
      </h2>
      <p className="mb-8 text-center font-mono text-xs text-flame-red/70">
        [{items.length} issues found]
      </p>
      <div className="space-y-4">
        {items.map((item, i) => (
          <RoastCard key={i} index={i} title={item.title} problem={item.problem} fix={item.fix} />
        ))}
      </div>
    </motion.section>
  );
};

export default RoastReport;
