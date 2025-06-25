import type { Habit } from "../../types";

export interface HabitFilterStrategy {
  filter(habits: Habit[]): Habit[];
}

export class FilterByCategory implements HabitFilterStrategy {
  constructor(private category: string) {}

  filter(habits: Habit[]): Habit[] {
    return habits.filter((habit) => habit.category === this.category);
  }
}

export class FilterByCompletionStatus implements HabitFilterStrategy {
  constructor(private completed: boolean) {}

  filter(habits: Habit[]): Habit[] {
    return habits.filter((habit) => habit.completed === this.completed);
  }
}

export class NoFilter implements HabitFilterStrategy {
  filter(habits: Habit[]): Habit[] {
    return habits;
  }
}
