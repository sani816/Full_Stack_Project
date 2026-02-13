import { StudyPlan, Subject } from "@/lib/studyPlanner";
import { isToday, isBefore, startOfDay, subDays, isEqual } from "date-fns";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StudyStatsProps {
  plan: StudyPlan;
  subjects: Subject[];
}

function calculateStreak(plan: StudyPlan): number {
  const today = startOfDay(new Date());
  let streak = 0;
  let day = today;

  // Check if today has tasks completed
  const todayTasks = plan.tasks.filter(
    (t) => isEqual(startOfDay(t.date), today)
  );
  const todayDone = todayTasks.length > 0 && todayTasks.every((t) => t.completed);

  if (todayDone) streak = 1;
  else if (todayTasks.length > 0 && todayTasks.some((t) => t.completed)) streak = 1;

  // Check previous days
  for (let i = 1; i <= 365; i++) {
    day = subDays(today, i);
    const dayTasks = plan.tasks.filter(
      (t) => isEqual(startOfDay(t.date), startOfDay(day))
    );
    if (dayTasks.length === 0) break;
    if (dayTasks.every((t) => t.completed)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function StudyStats({ plan, subjects }: StudyStatsProps) {
  const streak = calculateStreak(plan);
  const totalCompleted = plan.tasks.filter((t) => t.completed).length;
  const totalHoursStudied = plan.tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.hours, 0);
  const upcomingExams = subjects.filter(
    (s) => !isBefore(s.examDate, startOfDay(new Date()))
  ).length;

  const stats = [
    { label: "Day Streak", value: streak, icon: Flame, color: "text-accent" },
    { label: "Tasks Done", value: totalCompleted, icon: Target, color: "text-primary" },
    { label: "Hours Studied", value: totalHoursStudied, icon: Clock, color: "text-success" },
    { label: "Active Exams", value: upcomingExams, icon: TrendingUp, color: "text-warning" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-xl border border-border bg-card p-4 text-center"
        >
          <stat.icon className={`h-5 w-5 mx-auto mb-1.5 ${stat.color}`} />
          <p className="text-2xl font-heading text-foreground">{stat.value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
