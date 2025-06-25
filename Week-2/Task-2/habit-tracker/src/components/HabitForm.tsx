import React, { useState, useEffect } from "react";

interface HabitFormProps {
  onSave: (habit: Omit<Habit, "id" | "completed">) => void;
  currentHabit?: Habit;
}

interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  completed: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({ onSave, currentHabit }) => {
  const [title, setTitle] = useState(currentHabit?.title || "");
  const [category, setCategory] = useState(currentHabit?.category || "");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(
    currentHabit?.frequency || "daily"
  );

  useEffect(() => {
    if (currentHabit) {
      setTitle(currentHabit.title);
      setCategory(currentHabit.category);
      setFrequency(currentHabit.frequency);
    }
  }, [currentHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, category, frequency });
    setTitle("");
    setCategory("");
    setFrequency("daily");
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <div className="form-group">
        <label htmlFor="habit-title">Title</label>
        <input
          id="habit-title"
          type="text"
          placeholder="Enter habit title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="habit-category">Category</label>
        <input
          id="habit-category"
          type="text"
          placeholder="e.g., Health, Work, Hobby"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="habit-frequency">Frequency</label>
        <select
          id="habit-frequency"
          value={frequency}
          onChange={(e) =>
            setFrequency(e.target.value as "daily" | "weekly" | "monthly")
          }
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <button type="submit" className="button button-primary">
        {currentHabit ? "Update Habit" : "Add Habit"}
      </button>
    </form>
  );
};

export default HabitForm;
