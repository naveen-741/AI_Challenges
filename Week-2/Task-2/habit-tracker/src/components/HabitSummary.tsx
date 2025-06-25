import React, { useState, useEffect } from "react";
import type { Habit } from "../types";
import { habitSubject } from "../utils/HabitSubject";

const HabitSummary: React.FC = () => {
  const [totalHabits, setTotalHabits] = useState(0);
  const [completedHabits, setCompletedHabits] = useState(0);

  useEffect(() => {
    const observer = {
      update: (habits: Habit[]) => {
        setTotalHabits(habits.length);
        setCompletedHabits(habits.filter((habit) => habit.completed).length);
      },
    };

    habitSubject.subscribe(observer);

    // Initial update in case habits are already loaded before component mounts
    habitSubject.setHabits(habitSubject["habits"]); // Access private 'habits' for initial load

    return () => {
      habitSubject.unsubscribe(observer);
    };
  }, []);

  return (
    <div className="habit-summary">
      <p>Total Habits: {totalHabits}</p>
      <p>Completed Habits: {completedHabits}</p>
    </div>
  );
};

export default HabitSummary;
