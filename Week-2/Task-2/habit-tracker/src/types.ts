export interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  completed: boolean;
}

export interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
}
