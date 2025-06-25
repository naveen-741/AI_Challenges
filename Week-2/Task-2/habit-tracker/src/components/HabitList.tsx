import React from "react";
import type { Habit, HabitCardProps } from "../types";
import HabitCardFactory from "../utils/HabitCardFactory.tsx";
import type { HabitSortStrategy } from "../utils/strategies/HabitSortStrategy";
import type { HabitFilterStrategy } from "../utils/strategies/HabitFilterStrategy";

interface HabitListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
  sortStrategy: HabitSortStrategy;
  filterStrategy: HabitFilterStrategy;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  onEdit,
  onDelete,
  onToggleCompletion,
  sortStrategy,
  filterStrategy,
}) => {
  const habitCardProps: Omit<HabitCardProps, "habit"> = {
    onEdit,
    onDelete,
    onToggleCompletion,
  };

  const filteredHabits = filterStrategy.filter(habits);
  const sortedAndFilteredHabits = sortStrategy.sort(filteredHabits);

  return (
    <div className="habit-list">
      {sortedAndFilteredHabits.length === 0 ? (
        <p>
          No habits match your current filters. Try adjusting your criteria!
        </p>
      ) : (
        sortedAndFilteredHabits.map((habit) =>
          HabitCardFactory.createHabitCard(habit, habitCardProps)
        )
      )}
    </div>
  );
};

export default HabitList;
