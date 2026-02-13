import { Subject } from "@/lib/studyPlanner";
import { format, differenceInDays } from "date-fns";
import { Trash2, Clock, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface SubjectListProps {
  subjects: Subject[];
  onRemove: (id: string) => void;
  getProgress: (subject: Subject) => number;
}

export function SubjectList({ subjects, onRemove, getProgress }: SubjectListProps) {
  if (subjects.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-xl text-foreground">Your Subjects</h3>
      <AnimatePresence>
        {subjects.map((subject) => {
          const daysLeft = differenceInDays(subject.examDate, new Date());
          const progress = getProgress(subject);

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: subject.color, color: "white" }}
                  >
                    {subject.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{subject.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {daysLeft > 0 ? `${daysLeft}d left` : "Exam passed"}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {subject.hoursNeeded}h total
                      </span>
                      <span>Difficulty: {"●".repeat(subject.difficulty)}{"○".repeat(5 - subject.difficulty)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(subject.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={progress} className="flex-1 h-2" />
                <span className="text-xs font-medium text-muted-foreground w-10 text-right">{progress}%</span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
