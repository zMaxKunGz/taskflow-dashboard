export type TaskStatus = 'waiting' | 'in-progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  detail: string;
  assigneeId?: string;
  endDate?: Date;
  completed: boolean;
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
  files?: TaskFile[];
  subtasks?: Subtask[];
}

export interface TaskFile {
  id: string;
  name: string;
  size: number;
  type: string;
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
