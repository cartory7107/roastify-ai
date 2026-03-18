import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface RoastCardProps {
  title: string;
  problem: string;
  fix: string;
  index: number;
}

const RoastCard = ({ title, problem, fix, index }: RoastCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl glass-surface p-5"
    >
      {/* Left destructive bar */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-destructive" />

      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" strokeWidth={1.5} />
        <div className="flex-1">
          <h4 className="mb-1.5 font-mono text-xs font-bold uppercase tracking-tight text-destructive">
            {title}
          </h4>
          <p className="mb-3 text-sm leading-relaxed text-foreground/80">{problem}</p>
          <div className="rounded-lg bg-success/5 p-3 ring-1 ring-success/20">
            <p className="text-xs leading-relaxed text-success">
              <span className="font-bold">FIX:</span> {fix}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoastCard;
