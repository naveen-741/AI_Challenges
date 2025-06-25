import type { Habit } from "../../types";

export interface HabitSortStrategy {
  sort(habits: Habit[]): Habit[];
}

export class SortByTitleAsc implements HabitSortStrategy {
  sort(habits: Habit[]): Habit[] {
    return [...habits].sort((a, b) => a.title.localeCompare(b.title));
  }
}

export class SortByTitleDesc implements HabitSortStrategy {
  sort(habits: Habit[]): Habit[] {
    return [...habits].sort((a, b) => b.title.localeCompare(a.title));
  }
}

export class SortByCategoryAsc implements HabitSortStrategy {
  sort(habits: Habit[]): Habit[] {
    return [...habits].sort((a, b) => a.category.localeCompare(b.category));
  }
}

export class SortByCategoryDesc implements HabitSortStrategy {
  sort(habits: Habit[]): Habit[] {
    return [...habits].sort((a, b) => b.category.localeCompare(a.category));
  }
}

export class SortByCompletionStatus implements HabitSortStrategy {
  sort(habits: Habit[]): Habit[] {
    return [...habits].sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1
    );
  }
}
