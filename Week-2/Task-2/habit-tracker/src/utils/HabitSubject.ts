import type { Habit } from "../types";

interface Observer {
  update(habits: Habit[]): void;
}

class HabitSubject {
  private observers: Observer[] = [];
  private habits: Habit[] = [];

  public subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public setHabits(habits: Habit[]): void {
    this.habits = habits;
    this.notify();
  }

  private notify(): void {
    for (const observer of this.observers) {
      observer.update(this.habits);
    }
  }
}

export const habitSubject = new HabitSubject();
