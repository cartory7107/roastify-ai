import { motion } from "framer-motion";
import ScoreCircle from "./ScoreCircle";

interface Scores {
  design: number;
  seo: number;
  speed: number;
  conversion: number;
}

interface ScoreDashboardProps {
  scores: Scores;
}

const ScoreDashboard = ({ scores }: ScoreDashboardProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Performance Overview
      </h2>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <ScoreCircle score={scores.design} label="Design" color="" />
        <ScoreCircle score={scores.seo} label="SEO" color="" />
        <ScoreCircle score={scores.speed} label="Speed" color="" />
        <ScoreCircle score={scores.conversion} label="Conversion" color="" />
      </div>
    </motion.section>
  );
};

export default ScoreDashboard;
