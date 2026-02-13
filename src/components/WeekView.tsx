import { StudyPlan, getTasksForDate } from "@/lib/studyPlanner";
import { addDays, format, isEqual, startOfDay, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  plan: StudyPlan;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeekView({ plan, selectedDate, onSelectDate }: WeekViewProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = startOfDay(new Date());

  return (
    <div className="flex gap-1.5">
      {days.map((day) => {
        const tasks = getTasksForDate(plan, day);
        const isSelected = isEqual(startOfDay(day), startOfDay(selectedDate));
        const isToday = isEqual(startOfDay(day), today);
        const completedAll = tasks.length > 0 && tasks.every(t => t.completed);
        const hasTasks = tasks.length > 0;

        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelectDate(day)}
            className={cn(
              "flex-1 rounded-xl p-2 text-center transition-all",
              isSelected
                ? "bg-primary text-primary-foreground"
                : isToday
                  ? "bg-primary/10 text-foreground"
                  : "hover:bg-muted text-foreground"
            )}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-60">
              {format(day, "EEE")}
            </span>
            <div className="text-lg font-medium mt-0.5">{format(day, "d")}</div>
            <div className="flex justify-center gap-0.5 mt-1">
              {hasTasks && (
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  completedAll
                    ? isSelected ? "bg-primary-foreground" : "bg-success"
                    : isSelected ? "bg-primary-foreground/60" : "bg-primary/40"
                )} />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
