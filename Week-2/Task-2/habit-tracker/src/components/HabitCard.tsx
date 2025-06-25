import React from "react";
import type { Habit, HabitCardProps } from "../types";

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onEdit,
  onDelete,
  onToggleCompletion,
}) => {
  return (
    <div className="habit-card">
      <h3>{habit.title}</h3>
      <p>Category: {habit.category}</p>
      <p>Frequency: {habit.frequency}</p>
      <p className={`completion-status ${habit.completed ? "" : "incomplete"}`}>
        Completed: {habit.completed ? "Yes" : "No"}
      </p>
      <div className="actions">
        <button
          onClick={() => onToggleCompletion(habit.id)}
          className="button button-success"
        >
          {habit.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onClick={() => onEdit(habit)} className="button button-primary">
          Edit
        </button>
        <button
          onClick={() => onDelete(habit.id)}
          className="button button-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
