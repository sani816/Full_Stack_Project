import { useStudyPlanner } from "@/hooks/useStudyPlanner";
import { SubjectForm } from "@/components/SubjectForm";
import { SubjectList } from "@/components/SubjectList";
import { DailySchedule } from "@/components/DailySchedule";
import { WeekView } from "@/components/WeekView";
import { OverallProgress } from "@/components/OverallProgress";
import { StudyStats } from "@/components/StudyStats";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { StudyAssistant } from "@/components/StudyAssistant";
import { BookOpen, ChevronLeft, ChevronRight, Trash2, Sparkles } from "lucide-react";
import { addDays } from "date-fns";
import { motion } from "framer-motion";

const Index = () => {
  const {
    subjects,
    plan,
    selectedDate,
    setSelectedDate,
    addSubject,
    removeSubject,
    toggleTaskComplete,
    handleReschedule,
    todayTasks,
    getProgress,
    clearAll,
  } = useStudyPlanner();

  const hasSubjects = subjects.length > 0;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient glow backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-2xl text-foreground leading-tight">
                Smart Study <span className="gradient-text">Planner</span>
              </h1>
              <p className="text-xs text-muted-foreground">AI-powered scheduling for better results</p>
            </div>
          </div>
          {hasSubjects && (
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
        {!hasSubjects ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                <Sparkles className="h-3 w-3" />
                AI-Powered
              </div>
              <h2 className="font-heading text-4xl text-foreground">
                Plan your <span className="gradient-text">study journey</span>
              </h2>
              <p className="text-muted-foreground">
                Add your subjects and let the algorithm create a personalized study schedule with smart priority weighting.
              </p>
            </div>
            <SubjectForm onAdd={addSubject} />
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Stats bar */}
            <StudyStats plan={plan} subjects={subjects} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <SubjectForm onAdd={addSubject} />
                <PomodoroTimer />
                <SubjectList subjects={subjects} onRemove={removeSubject} getProgress={getProgress} />
              </div>

              {/* Right column */}
              <div className="lg:col-span-2 space-y-6">
                <OverallProgress plan={plan} subjects={subjects} />

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSelectedDate(new Date())}
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <WeekView plan={plan} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                </div>

                <DailySchedule
                  tasks={todayTasks}
                  selectedDate={selectedDate}
                  onToggleComplete={toggleTaskComplete}
                  onReschedule={handleReschedule}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Study Assistant */}
      <StudyAssistant subjects={subjects} getProgress={getProgress} />
    </div>
  );
};

export default Index;
