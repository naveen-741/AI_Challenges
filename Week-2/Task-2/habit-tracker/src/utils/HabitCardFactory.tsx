import React from "react";
import type { Habit, HabitCardProps } from "../types";
import HabitCard from "../components/HabitCard";

// A simple factory for now, can be extended for different card types
class HabitCardFactory {
  static createHabitCard(
    habit: Habit,
    props: Omit<HabitCardProps, "habit">
  ): React.ReactElement {
    // In a more complex scenario, you might have different card types based on habit.category or other properties.
    // For this basic implementation, we'll just return the generic HabitCard.
    return <HabitCard key={habit.id} habit={habit} {...props} />;
  }
}

export default HabitCardFactory;
