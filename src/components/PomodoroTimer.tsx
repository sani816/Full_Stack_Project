import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STUDY_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(STUDY_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const totalDuration = isBreak ? BREAK_DURATION : STUDY_DURATION;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        setIsRunning(false);
        if (!isBreak) {
          setSessions((s) => s + 1);
          setIsBreak(true);
          return BREAK_DURATION;
        } else {
          setIsBreak(false);
          return STUDY_DURATION;
        }
      }
      return prev - 1;
    });
  }, [isBreak]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(STUDY_DURATION);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg text-foreground">Pomodoro Timer</h3>
        <span className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-full",
          isBreak ? "bg-success/15 text-success" : "bg-primary/15 text-primary"
        )}>
          {isBreak ? "Break" : "Focus"}
        </span>
      </div>

      {/* Circular progress */}
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" strokeWidth="6" className="stroke-muted" />
            <motion.circle
              cx="50" cy="50" r="44" fill="none" strokeWidth="6"
              strokeLinecap="round"
              className={isBreak ? "stroke-success" : "stroke-primary"}
              strokeDasharray={276.46}
              animate={{ strokeDashoffset: 276.46 - (276.46 * progress) / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-heading text-foreground tabular-nums">
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button
            onClick={reset}
            className="h-10 w-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
          <Coffee className="h-3 w-3" />
          <span>{sessions} session{sessions !== 1 ? "s" : ""} today</span>
        </div>
      </div>
    </div>
  );
}
