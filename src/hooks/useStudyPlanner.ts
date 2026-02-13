import { useState, useCallback, useEffect } from "react";
import {
  Subject,
  StudyPlan,
  DailyTask,
  generateStudyPlan,
  rescheduleMissedTasks,
  getTasksForDate,
  getSubjectProgress,
  generateId,
  getNextColor,
  resetColorIndex,
} from "@/lib/studyPlanner";

const STORAGE_KEY = "smart-study-planner";

interface StoredData {
  subjects: Subject[];
  plan: StudyPlan;
  studyHoursPerDay: number;
}

function loadFromStorage(): StoredData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    // Rehydrate dates
    parsed.subjects = parsed.subjects.map((s: any) => ({
      ...s,
      examDate: new Date(s.examDate),
    }));
    parsed.plan.tasks = parsed.plan.tasks.map((t: any) => ({
      ...t,
      date: new Date(t.date),
    }));
    parsed.plan.startDate = new Date(parsed.plan.startDate);
    parsed.plan.endDate = new Date(parsed.plan.endDate);
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(data: StoredData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useStudyPlanner() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plan, setPlan] = useState<StudyPlan>({ tasks: [], startDate: new Date(), endDate: new Date() });
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(6);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setSubjects(stored.subjects);
      setPlan(stored.plan);
      setStudyHoursPerDay(stored.studyHoursPerDay);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (subjects.length > 0) {
      saveToStorage({ subjects, plan, studyHoursPerDay });
    }
  }, [subjects, plan, studyHoursPerDay]);

  const addSubject = useCallback((name: string, difficulty: 1|2|3|4|5, examDate: Date, hoursNeeded: number) => {
    const newSubject: Subject = {
      id: generateId(),
      name,
      difficulty,
      examDate,
      hoursNeeded,
      completedHours: 0,
      color: getNextColor(),
    };
    setSubjects(prev => {
      const updated = [...prev, newSubject];
      const newPlan = generateStudyPlan(updated, studyHoursPerDay);
      setPlan(newPlan);
      return updated;
    });
  }, [studyHoursPerDay]);

  const removeSubject = useCallback((id: string) => {
    setSubjects(prev => {
      const updated = prev.filter(s => s.id !== id);
      resetColorIndex();
      const newPlan = generateStudyPlan(updated, studyHoursPerDay);
      setPlan(newPlan);
      return updated;
    });
  }, [studyHoursPerDay]);

  const toggleTaskComplete = useCallback((taskId: string) => {
    setPlan(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t),
    }));
  }, []);

  const handleReschedule = useCallback(() => {
    const newPlan = rescheduleMissedTasks(plan, subjects, studyHoursPerDay);
    setPlan(newPlan);
  }, [plan, subjects, studyHoursPerDay]);

  const regeneratePlan = useCallback(() => {
    const newPlan = generateStudyPlan(subjects, studyHoursPerDay);
    setPlan(newPlan);
  }, [subjects, studyHoursPerDay]);

  const todayTasks = getTasksForDate(plan, selectedDate);

  const getProgress = useCallback((subject: Subject) => {
    return getSubjectProgress(plan, subject);
  }, [plan]);

  const clearAll = useCallback(() => {
    setSubjects([]);
    setPlan({ tasks: [], startDate: new Date(), endDate: new Date() });
    resetColorIndex();
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    subjects,
    plan,
    studyHoursPerDay,
    setStudyHoursPerDay,
    selectedDate,
    setSelectedDate,
    addSubject,
    removeSubject,
    toggleTaskComplete,
    handleReschedule,
    regeneratePlan,
    todayTasks,
    getProgress,
    clearAll,
  };
}
