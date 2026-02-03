export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Date;
  endDate: Date;
  tags: string[];
  subtasks?: Subtask[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

export interface TaskSuggestion {
  title: string;
  description: string;
  priority: TaskPriority;
  tags: string[];
  estimatedDays: number;
}
