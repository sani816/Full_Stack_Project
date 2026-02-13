import { StudyPlan, Subject } from "@/lib/studyPlanner";
import { motion } from "framer-motion";

interface OverallProgressProps {
  plan: StudyPlan;
  subjects: Subject[];
}

export function OverallProgress({ plan, subjects }: OverallProgressProps) {
  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter(t => t.completed).length;
  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (subjects.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-xl text-foreground">Overall Progress</h3>
        <span className="text-2xl font-heading text-primary">{overallPercent}%</span>
      </div>

      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${overallPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
        />
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        {completedTasks} of {totalTasks} tasks completed
      </p>
    </div>
  );
}
