import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";

interface SubjectFormProps {
  onAdd: (name: string, difficulty: 1|2|3|4|5, examDate: Date, hoursNeeded: number) => void;
}

const difficultyLabels = ["Easy", "Medium", "Hard", "Very Hard", "Expert"];

export function SubjectForm({ onAdd }: SubjectFormProps) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<1|2|3|4|5>(3);
  const [examDate, setExamDate] = useState<Date>();
  const [hoursNeeded, setHoursNeeded] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !examDate) return;
    onAdd(name.trim(), difficulty, examDate, hoursNeeded);
    setName("");
    setDifficulty(3);
    setExamDate(undefined);
    setHoursNeeded(20);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-border bg-card p-6"
    >
      <h3 className="font-heading text-xl text-foreground">Add a Subject</h3>

      <div className="space-y-2">
        <Label htmlFor="subject-name">Subject Name</Label>
        <Input
          id="subject-name"
          placeholder="e.g. Mathematics"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <div className="flex gap-2">
          {([1, 2, 3, 4, 5] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium transition-all",
                difficulty === level
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50"
              )}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{difficultyLabels[difficulty - 1]}</p>
      </div>

      <div className="space-y-2">
        <Label>Exam Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !examDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {examDate ? format(examDate, "PPP") : "Pick exam date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={examDate}
              onSelect={setExamDate}
              disabled={(date) => date < new Date()}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours">Estimated Study Hours</Label>
        <Input
          id="hours"
          type="number"
          min={1}
          max={500}
          value={hoursNeeded}
          onChange={(e) => setHoursNeeded(Number(e.target.value))}
        />
      </div>

      <Button type="submit" className="w-full" disabled={!name.trim() || !examDate}>
        <Plus className="mr-2 h-4 w-4" />
        Add Subject
      </Button>
    </motion.form>
  );
}
