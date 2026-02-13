import { differenceInDays, addDays, format, isAfter, isBefore, isEqual, startOfDay } from "date-fns";

export interface Subject {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=easy, 5=hardest
  examDate: Date;
  hoursNeeded: number; // estimated total hours
  completedHours: number;
  color: string;
}

export interface DailyTask {
  id: string;
  date: Date;
  subjectId: string;
  subjectName: string;
  hours: number;
  type: "study" | "revision";
  completed: boolean;
  color: string;
}

export interface StudyPlan {
  tasks: DailyTask[];
  startDate: Date;
  endDate: Date;
}

const SUBJECT_COLORS = [
  "hsl(36, 80%, 50%)",
  "hsl(200, 60%, 50%)",
  "hsl(145, 50%, 42%)",
  "hsl(340, 60%, 55%)",
  "hsl(270, 50%, 55%)",
  "hsl(15, 70%, 55%)",
  "hsl(180, 50%, 42%)",
  "hsl(55, 70%, 45%)",
];

let colorIndex = 0;
export function getNextColor(): string {
  const color = SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length];
  colorIndex++;
  return color;
}

export function resetColorIndex() {
  colorIndex = 0;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function generateStudyPlan(subjects: Subject[], studyHoursPerDay: number = 6): StudyPlan {
  if (subjects.length === 0) return { tasks: [], startDate: new Date(), endDate: new Date() };

  const today = startOfDay(new Date());
  const endDate = subjects.reduce((latest, s) => isAfter(s.examDate, latest) ? s.examDate : latest, subjects[0].examDate);

  // Calculate weight for each subject based on difficulty and urgency
  const subjectWeights = subjects.map(subject => {
    const daysUntilExam = Math.max(1, differenceInDays(subject.examDate, today));
    const remainingHours = Math.max(0, subject.hoursNeeded - subject.completedHours);
    const urgency = remainingHours / daysUntilExam; // hours needed per day
    const difficultyWeight = subject.difficulty / 3; // normalize around 1
    const weight = urgency * difficultyWeight;
    
    return {
      subject,
      weight,
      remainingHours,
      daysUntilExam,
    };
  });

  const tasks: DailyTask[] = [];
  const totalDays = Math.max(1, differenceInDays(endDate, today));

  for (let dayOffset = 0; dayOffset <= totalDays; dayOffset++) {
    const currentDate = addDays(today, dayOffset);
    let remainingDayHours = studyHoursPerDay;

    // Filter subjects whose exam hasn't passed
    const activeSubjects = subjectWeights.filter(sw => 
      !isBefore(sw.subject.examDate, currentDate) && sw.remainingHours > 0
    );

    if (activeSubjects.length === 0) continue;

    // Sort by weight descending (highest priority first)
    activeSubjects.sort((a, b) => b.weight - a.weight);

    // Calculate total weight for proportional allocation
    const totalWeight = activeSubjects.reduce((sum, s) => sum + s.weight, 0);

    for (const sw of activeSubjects) {
      if (remainingDayHours <= 0) break;

      const proportion = totalWeight > 0 ? sw.weight / totalWeight : 1 / activeSubjects.length;
      let allocatedHours = Math.round(studyHoursPerDay * proportion * 2) / 2; // round to 0.5
      allocatedHours = Math.min(allocatedHours, remainingDayHours, sw.remainingHours);
      allocatedHours = Math.max(allocatedHours, 0.5);

      if (allocatedHours > 0 && remainingDayHours >= allocatedHours) {
        // Add revision slot 2 days before exam
        const daysToExam = differenceInDays(sw.subject.examDate, currentDate);
        const isRevision = daysToExam <= 2;

        tasks.push({
          id: generateId(),
          date: currentDate,
          subjectId: sw.subject.id,
          subjectName: sw.subject.name,
          hours: allocatedHours,
          type: isRevision ? "revision" : "study",
          completed: false,
          color: sw.subject.color,
        });

        sw.remainingHours -= allocatedHours;
        remainingDayHours -= allocatedHours;
      }
    }
  }

  return { tasks, startDate: today, endDate };
}

export function rescheduleMissedTasks(
  plan: StudyPlan,
  subjects: Subject[],
  studyHoursPerDay: number = 6
): StudyPlan {
  const today = startOfDay(new Date());
  
  // Find incomplete tasks from past days
  const missedTasks = plan.tasks.filter(t => 
    isBefore(t.date, today) && !t.completed
  );

  if (missedTasks.length === 0) return plan;

  // Calculate missed hours per subject
  const missedHoursMap = new Map<string, number>();
  missedTasks.forEach(t => {
    missedHoursMap.set(t.subjectId, (missedHoursMap.get(t.subjectId) || 0) + t.hours);
  });

  // Update subjects with additional hours needed
  const updatedSubjects = subjects.map(s => ({
    ...s,
    hoursNeeded: s.hoursNeeded + (missedHoursMap.get(s.id) || 0),
  }));

  // Remove old incomplete past tasks, keep completed ones and future ones
  const keptTasks = plan.tasks.filter(t => 
    t.completed || !isBefore(t.date, today)
  );

  // Regenerate future schedule
  const newPlan = generateStudyPlan(updatedSubjects, studyHoursPerDay);
  
  return {
    tasks: [...keptTasks.filter(t => isBefore(t.date, today)), ...newPlan.tasks],
    startDate: plan.startDate,
    endDate: newPlan.endDate,
  };
}

export function getTasksForDate(plan: StudyPlan, date: Date): DailyTask[] {
  const target = startOfDay(date);
  return plan.tasks.filter(t => isEqual(startOfDay(t.date), target));
}

export function getSubjectProgress(plan: StudyPlan, subject: Subject): number {
  const subjectTasks = plan.tasks.filter(t => t.subjectId === subject.id);
  if (subjectTasks.length === 0) return 0;
  const completed = subjectTasks.filter(t => t.completed).length;
  return Math.round((completed / subjectTasks.length) * 100);
}
