import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface HeatLevelProps {
  score: number;
}

const HeatLevel = ({ score }: HeatLevelProps) => {
  const getLevel = () => {
    if (score >= 70) return { label: "Mild Roast", emoji: "🔥", description: "Not bad! Just a light toast.", color: "text-flame-yellow" };
    if (score >= 40) return { label: "Medium Roast", emoji: "🔥🔥", description: "Getting crispy. Needs work.", color: "text-flame-orange" };
    return { label: "Brutal Roast", emoji: "🔥🔥🔥", description: "Completely scorched. Major fixes needed.", color: "text-flame-red" };
  };

  const level = getLevel();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="mx-auto mt-4 flex items-center justify-center gap-3 rounded-full border border-flame-orange/15 bg-flame-orange/5 px-6 py-2.5"
    >
      <Flame className={`h-4 w-4 ${level.color}`} />
      <span className={`text-sm font-bold ${level.color}`}>{level.emoji} {level.label}</span>
      <span className="text-xs text-muted-foreground">— {level.description}</span>
    </motion.div>
  );
};

export default HeatLevel;
