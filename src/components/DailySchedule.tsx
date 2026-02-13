import { DailyTask } from "@/lib/studyPlanner";
import { format } from "date-fns";
import { Check, RotateCcw, BookOpen, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DailyScheduleProps {
  tasks: DailyTask[];
  selectedDate: Date;
  onToggleComplete: (taskId: string) => void;
  onReschedule: () => void;
}

export function DailySchedule({ tasks, selectedDate, onToggleComplete, onReschedule }: DailyScheduleProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl text-foreground">
            {format(selectedDate, "EEEE, MMM d")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tasks.length > 0
              ? `${completedCount}/${tasks.length} tasks · ${totalHours}h planned`
              : "No tasks scheduled"}
          </p>
        </div>
        {tasks.some(t => !t.completed) && (
          <button
            onClick={onReschedule}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reschedule
          </button>
        )}
      </div>

      <AnimatePresence>
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-border py-12 text-center"
          >
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No tasks for this day</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onToggleComplete(task.id)}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all",
                  task.completed
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                    task.completed
                      ? "border-success bg-success"
                      : "border-muted-foreground/30"
                  )}
                >
                  {task.completed && <Check className="h-3.5 w-3.5 text-success-foreground" />}
                </div>

                <div
                  className="h-8 w-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: task.color }}
                />

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm",
                    task.completed ? "line-through text-muted-foreground" : "text-foreground"
                  )}>
                    {task.subjectName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{task.hours}h</span>
                    {task.type === "revision" && (
                      <span className="flex items-center gap-1 text-accent">
                        <Brain className="h-3 w-3" />
                        Revision
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
