import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
  tag: string;
  index: number;
}

export default function ToolCard({ name, description, path, icon: Icon, tag, index }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={path} className="group block p-5 rounded-xl border border-border bg-surface hover:border-primary/40 hover:glow-border transition-all duration-300 hover:-translate-y-1">
        <Icon className="w-8 h-8 text-primary mb-3" />
        <h3 className="font-display font-bold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <span className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
      </Link>
    </motion.div>
  );
}
