export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type SortBy = 'createdAt' | 'dueDate' | 'priority';