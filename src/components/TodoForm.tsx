'use client';

import { useTodoStore } from '@/store/todoStore';
import { useTodoForm } from '@/hooks/useTodo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Tag, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

interface TodoFormProps {
  onSuccess?: () => void;
}

export function TodoForm({ onSuccess }: TodoFormProps) {
  const addTodo = useTodoStore((state) => state.addTodo);
  const { formData, updateField, resetForm } = useTodoForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a todo title');
      return;
    }

    addTodo({
      title: formData.title,
      description: formData.description || undefined,
      priority: (formData.priority as 'low' | 'medium' | 'high') || 'medium',
      category: formData.category || undefined,
      dueDate: formData.dueDate || undefined,
      completed: false,
    });

    resetForm();
    toast.success('Todo added successfully!');
    onSuccess?.();
  };

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Todo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter todo title"
              className="rounded-2xl"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter todo description (optional)"
              className="w-full px-4 py-2 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <Input
                type="text"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                placeholder="e.g., Work, Personal"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              className="rounded-2xl"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-600 h-11 text-base font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Todo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
