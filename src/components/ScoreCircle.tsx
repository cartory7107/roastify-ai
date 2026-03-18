import { motion } from "framer-motion";

interface ScoreCircleProps {
  score: number;
  label: string;
  color: string;
}

const ScoreCircle = ({ score, label }: ScoreCircleProps) => {
  const getGradientId = () => `fire-grad-${label.toLowerCase()}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28">
        {/* Glow behind */}
        <div
          className="absolute inset-2 rounded-full blur-md"
          style={{
            background: score >= 70
              ? "hsla(152, 60%, 45%, 0.15)"
              : score >= 40
              ? "hsla(24, 100%, 50%, 0.15)"
              : "hsla(6, 100%, 50%, 0.15)"
          }}
        />
        <svg className="relative h-full w-full -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(6, 100%, 50%)" />
              <stop offset="50%" stopColor="hsl(24, 100%, 50%)" />
              <stop offset="100%" stopColor="hsl(36, 100%, 63%)" />
            </linearGradient>
          </defs>
          <circle
            className="stroke-muted/20"
            strokeWidth="6"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <motion.circle
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            stroke={score >= 70 ? "hsl(152, 60%, 45%)" : `url(#${getGradientId()})`}
            strokeWidth="6"
            strokeLinecap="round"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            style={{ pathLength: 0, filter: "drop-shadow(0 0 6px hsla(24, 100%, 50%, 0.4))" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold text-foreground">
          {score}
        </span>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

export default ScoreCircle;
