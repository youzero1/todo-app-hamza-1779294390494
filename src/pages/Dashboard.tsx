import React, { useState, useMemo } from 'react';
import { Search, Filter, SortDesc, CheckCircle2, ListTodo, Clock } from 'lucide-react';
import { Todo, TodoFilter, Priority, SortBy } from '@/types';
import { TodoItem } from '@/components/TodoItem';
import { TodoForm } from '@/components/TodoForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos-v1', []);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');

  const handleAddTodo = (title: string, description: string, priority: Priority, dueDate?: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    if (search) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const weights = { high: 3, medium: 2, low: 1 };
        return weights[b.priority] - weights[a.priority];
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [todos, filter, search, sortBy]);

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">FlowTask</h1>
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <p className="text-slate-400 font-medium">Completed</p>
                <p className="text-slate-900 font-bold">{stats.completed}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 font-medium">Active</p>
                <p className="text-slate-900 font-bold">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none"
            >
              <option value="createdAt">Sort by Created</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <TodoForm onAdd={handleAddTodo} />

        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6">
          {(['all', 'active', 'completed'] as TodoFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all",
                filter === f 
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence mode='popLayout'>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </AnimatePresence>

          {filteredTodos.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                {search ? "No tasks matching your search" : "No tasks found in this view"}
              </p>
              <p className="text-slate-400 text-sm">
                Get started by adding a new task above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}