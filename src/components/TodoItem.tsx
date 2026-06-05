'use client';

import { useTodoStore } from '@/store/todoStore';
import { useState } from 'react';
import { Check, Trash2, Calendar, Flag, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface TodoItemProps {
  todoId: string;
}

const priorityColors = {
  low: 'bg-blue-50 border-blue-200 text-blue-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  high: 'bg-red-50 border-red-200 text-red-700',
};

const priorityIcons = {
  low: 'w-4 h-4 text-blue-500',
  medium: 'w-4 h-4 text-yellow-500',
  high: 'w-4 h-4 text-red-500',
};

export function TodoItem({ todoId }: TodoItemProps) {
  const todo = useTodoStore((state) => state.getTodoById(todoId));
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo?.title || '');

  if (!todo) return null;

  const handleToggle = () => {
    toggleTodo(todoId);
  };

  const handleDelete = () => {
    deleteTodo(todoId);
    toast.success('Todo deleted');
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTodo(todoId, { title: editTitle });
      setIsEditing(false);
      toast.success('Todo updated');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-cyan-500 border-cyan-500'
                : 'border-slate-300 hover:border-cyan-500'
            }`}
          >
            {todo.completed && <Check className="w-4 h-4 text-white" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  autoFocus
                />
                <Button
                  onClick={handleSaveEdit}
                  size="sm"
                  className="rounded-lg bg-cyan-500 hover:bg-cyan-600"
                >
                  Save
                </Button>
              </div>
            ) : (
              <h3
                onClick={() => setIsEditing(true)}
                className={`text-sm font-medium cursor-pointer hover:text-cyan-600 transition-colors ${
                  todo.completed ? 'line-through text-slate-400' : 'text-slate-900'
                }`}
              >
                {todo.title}
              </h3>
            )}

            {todo.description && (
              <p className="text-sm text-slate-500 mt-1">{todo.description}</p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  priorityColors[todo.priority]
                }`}
              >
                <Flag className={priorityIcons[todo.priority]} />
                {todo.priority}
              </span>

              {/* Category Badge */}
              {todo.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <Tag className="w-3 h-3" />
                  {todo.category}
                </span>
              )}

              {/* Due Date */}
              {todo.dueDate && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <Calendar className="w-3 h-3" />
                  {formatDate(todo.dueDate)}
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete todo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
