class TaskManager {
  constructor() {
    this.tasks = [];
    this.categories = new Set(["work", "personal", "shopping", "health"]);
  }

  addTask(title, category, priority = "medium") {
    if (!this.categories.has(category)) {
      throw new Error("Invalid category");
    }

    const task = {
      id: Date.now(),
      title,
      category,
      priority,
      completed: false,
      createdAt: new Date(),
      completedAt: null,
    };

    this.tasks.push(task);
    return task;
  }

  completeTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    task.completed = true;
    task.completedAt = new Date();
    return task;
  }

  getTasksByCategory(category) {
    return this.tasks.filter((task) => task.category === category);
  }

  getTasksByPriority(priority) {
    return this.tasks.filter((task) => task.priority === priority);
  }

  getIncompleteTasks() {
    return this.tasks.filter((task) => !task.completed);
  }

  getTaskStatistics() {
    const stats = {
      total: this.tasks.length,
      completed: this.tasks.filter((t) => t.completed).length,
      byCategory: {},
      byPriority: {
        high: 0,
        medium: 0,
        low: 0,
      },
    };

    this.tasks.forEach((task) => {
      stats.byCategory[task.category] =
        (stats.byCategory[task.category] || 0) + 1;
      stats.byPriority[task.priority]++;
    });

    return stats;
  }
}

// Example usage
const taskManager = new TaskManager();

// Add some tasks
taskManager.addTask("Buy groceries", "shopping", "high");
taskManager.addTask("Complete project report", "work", "high");
taskManager.addTask("Go for a run", "health", "medium");
taskManager.addTask("Call mom", "personal", "low");

// Complete a task
taskManager.completeTask(taskManager.tasks[0].id);

// Get statistics
console.log(taskManager.getTaskStatistics());
