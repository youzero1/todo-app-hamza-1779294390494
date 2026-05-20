import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Priority } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface TodoFormProps {
  onAdd: (title: string, description: string, priority: Priority, dueDate?: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd(title, description, priority, dueDate || undefined);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsOpen(false);
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-full py-4 border-2 border-dashed border-slate-200 bg-transparent text-slate-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add a new task
        </Button>
      ) : (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-xl border-2 border-blue-100 shadow-xl space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Create Task</h2>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Task Title
              </label>
              <input
                autoFocus
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Task
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  );
}