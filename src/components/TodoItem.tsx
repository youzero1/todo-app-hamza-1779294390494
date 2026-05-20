import React from 'react';
import { CheckCircle2, Circle, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Todo } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const priorityColors = {
    low: 'text-emerald-500 bg-emerald-50',
    medium: 'text-amber-500 bg-amber-50',
    high: 'text-rose-500 bg-rose-50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
    >
      <button
        onClick={() => onToggle(todo.id)}
        className="mt-1 text-slate-400 hover:text-blue-500 transition-colors"
      >
        {todo.completed ? (
          <CheckCircle2 className="w-6 h-6 text-blue-500" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "text-base font-semibold truncate",
            todo.completed ? "text-slate-400 line-through" : "text-slate-900"
          )}>
            {todo.title}
          </h3>
          <span className={cn(
            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
            priorityColors[todo.priority]
          )}>
            {todo.priority}
          </span>
        </div>
        
        {todo.description && (
          <p className={cn(
            "text-sm text-slate-500 line-clamp-2 mb-2",
            todo.completed && "opacity-50"
          )}>
            {todo.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {todo.dueDate && (
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(todo.dueDate), 'MMM d, yyyy')}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            Created {format(new Date(todo.createdAt), 'MMM d')}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
}