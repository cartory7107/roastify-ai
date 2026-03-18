import { motion } from "framer-motion";

interface ScoreCircleProps {
  score: number;
  label: string;
  color: string;
}

const ScoreCircle = ({ score, label, color }: ScoreCircleProps) => {
  const getScoreColor = () => {
    if (score >= 80) return "hsl(var(--success))";
    if (score >= 50) return "hsl(var(--accent))";
    return "hsl(var(--destructive))";
  };

  const finalColor = color || getScoreColor();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className="stroke-muted/30"
            strokeWidth="8"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <motion.circle
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            stroke={finalColor}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            style={{ pathLength: 0 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold text-foreground">
          {score}
        </span>
      </div>
      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

export default ScoreCircle;
