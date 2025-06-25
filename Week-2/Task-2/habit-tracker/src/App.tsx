import React, { useState, useEffect } from "react";
import type { Habit } from "./types";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";
import {
  SortByTitleAsc,
  SortByTitleDesc,
  SortByCategoryAsc,
  SortByCategoryDesc,
  SortByCompletionStatus,
} from "./utils/strategies/HabitSortStrategy";
import {
  FilterByCategory,
  FilterByCompletionStatus,
  NoFilter,
} from "./utils/strategies/HabitFilterStrategy";
import type { HabitSortStrategy } from "./utils/strategies/HabitSortStrategy";
import type { HabitFilterStrategy } from "./utils/strategies/HabitFilterStrategy";
import { habitSubject } from "./utils/HabitSubject";
import HabitSummary from "./components/HabitSummary";
import "./App.css";

// localStorage utilities
const loadHabits = (): Habit[] => {
  const storedHabits = localStorage.getItem("habits");
  return storedHabits ? JSON.parse(storedHabits) : [];
};

const saveHabits = (habits: Habit[]) => {
  localStorage.setItem("habits", JSON.stringify(habits));
  habitSubject.setHabits(habits); // Notify observers
};

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(
    undefined
  );
  const [sortStrategy, setSortStrategy] = useState<HabitSortStrategy>(
    new SortByTitleAsc()
  );
  const [filterStrategy, setFilterStrategy] = useState<HabitFilterStrategy>(
    new NoFilter()
  );
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterCompleted, setFilterCompleted] = useState<string>("all");

  useEffect(() => {
    setHabits(loadHabits());
  }, []);

  const addHabit = (habit: Omit<Habit, "id" | "completed">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completed: false,
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const editHabit = (id: string, updatedHabit: Partial<Habit>) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, ...updatedHabit } : habit
    );
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    setEditingHabit(undefined);
  };

  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const toggleCompletion = (id: string) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const handleEditClick = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    switch (value) {
      case "title-asc":
        setSortStrategy(new SortByTitleAsc());
        break;
      case "title-desc":
        setSortStrategy(new SortByTitleDesc());
        break;
      case "category-asc":
        setSortStrategy(new SortByCategoryAsc());
        break;
      case "category-desc":
        setSortStrategy(new SortByCategoryDesc());
        break;
      case "completion":
        setSortStrategy(new SortByCompletionStatus());
        break;
      default:
        setSortStrategy(new SortByTitleAsc());
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilterCompleted(value);
    if (value === "all") {
      setFilterStrategy(new NoFilter());
    } else {
      setFilterStrategy(new FilterByCompletionStatus(value === "completed"));
    }
  };

  const handleCategoryFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFilterCategory(value);
    if (value === "") {
      setFilterStrategy(new NoFilter());
    } else {
      setFilterStrategy(new FilterByCategory(value));
    }
  };

  return (
    <div className="App">
      <h1>Habit Tracker</h1>

      <div className="habit-form-section">
        <h2 className="section-title">Add/Edit Habit</h2>
        <HabitForm
          onSave={
            editingHabit ? (h) => editHabit(editingHabit.id, h) : addHabit
          }
          currentHabit={editingHabit}
        />
      </div>

      <div className="filters-sorts-section">
        <h2 className="section-title">Filter & Sort Habits</h2>
        <div className="filters-sorts">
          <div className="form-group">
            <label>Sort by:</label>
            <select onChange={handleSortChange}>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="category-asc">Category (A-Z)</option>
              <option value="category-desc">Category (Z-A)</option>
              <option value="completion">Completion Status</option>
            </select>
          </div>

          <div className="form-group">
            <label>Filter by Completion:</label>
            <select onChange={handleFilterChange} value={filterCompleted}>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>

          <div className="form-group">
            <label>Filter by Category:</label>
            <input
              type="text"
              placeholder="Filter by Category"
              value={filterCategory}
              onChange={handleCategoryFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="habit-list-section">
        <h2 className="section-title">Your Habits</h2>
        <HabitList
          habits={habits}
          onEdit={handleEditClick}
          onDelete={deleteHabit}
          onToggleCompletion={toggleCompletion}
          sortStrategy={sortStrategy}
          filterStrategy={filterStrategy}
        />
      </div>

      <div className="habit-summary-section">
        <h2 className="section-title">Habit Summary</h2>
        <HabitSummary />
      </div>
    </div>
  );
}

export default App;
