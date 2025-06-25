from datetime import datetime
from typing import Dict, List, Set, Optional

class TaskManager:
    def __init__(self):
        self.tasks: List[Dict] = []
        self.categories: Set[str] = {'work', 'personal', 'shopping', 'health'}

    def add_task(self, title: str, category: str, priority: str = 'medium') -> Dict:
        if category not in self.categories:
            raise ValueError("Invalid category")
        
        task = {
            'id': int(datetime.now().timestamp() * 1000),
            'title': title,
            'category': category,
            'priority': priority,
            'completed': False,
            'created_at': datetime.now(),
            'completed_at': None
        }
        
        self.tasks.append(task)
        return task

    def complete_task(self, task_id: int) -> Dict:
        task = next((t for t in self.tasks if t['id'] == task_id), None)
        if not task:
            raise ValueError("Task not found")
        
        task['completed'] = True
        task['completed_at'] = datetime.now()
        return task

    def get_tasks_by_category(self, category: str) -> List[Dict]:
        return [task for task in self.tasks if task['category'] == category]

    def get_tasks_by_priority(self, priority: str) -> List[Dict]:
        return [task for task in self.tasks if task['priority'] == priority]

    def get_incomplete_tasks(self) -> List[Dict]:
        return [task for task in self.tasks if not task['completed']]

    def get_task_statistics(self) -> Dict:
        stats = {
            'total': len(self.tasks),
            'completed': len([t for t in self.tasks if t['completed']]),
            'by_category': {},
            'by_priority': {
                'high': 0,
                'medium': 0,
                'low': 0
            }
        }

        for task in self.tasks:
            stats['by_category'][task['category']] = stats['by_category'].get(task['category'], 0) + 1
            stats['by_priority'][task['priority']] += 1

        return stats


# Example usage
if __name__ == "__main__":
    task_manager = TaskManager()

    # Add some tasks
    task_manager.add_task("Buy groceries", "shopping", "high")
    task_manager.add_task("Complete project report", "work", "high")
    task_manager.add_task("Go for a run", "health", "medium")
    task_manager.add_task("Call mom", "personal", "low")

    # Complete a task
    task_manager.complete_task(task_manager.tasks[0]['id'])

    # Get statistics
    print(task_manager.get_task_statistics()) 