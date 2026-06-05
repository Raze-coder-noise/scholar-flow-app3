import { useMemo, useState } from 'react';
import { useTodoStore, type Todo } from '@/store/todoStore';

export interface TodoFilter {
  status?: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'all';
  category?: string | 'all';
  searchQuery?: string;
}

export function useTodoFilters(filter: TodoFilter) {
  const todos = useTodoStore((state) => state.todos);

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Filter by status
    if (filter.status === 'active') {
      result = result.filter((todo) => !todo.completed);
    } else if (filter.status === 'completed') {
      result = result.filter((todo) => todo.completed);
    }

    // Filter by priority
    if (filter.priority && filter.priority !== 'all') {
      result = result.filter((todo) => todo.priority === filter.priority);
    }

    // Filter by category
    if (filter.category && filter.category !== 'all') {
      result = result.filter((todo) => todo.category === filter.category);
    }

    // Search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          (todo.description?.toLowerCase().includes(query) || false)
      );
    }

    return result;
  }, [todos, filter]);

  return filteredTodos;
}

export function useTodoStats() {
  const todos = useTodoStore((state) => state.todos);
  const completed = useTodoStore((state) => state.getCompletedTodos());
  const active = useTodoStore((state) => state.getActiveTodos());

  return {
    total: todos.length,
    completed: completed.length,
    active: active.length,
    completionRate: todos.length > 0 ? Math.round((completed.length / todos.length) * 100) : 0,
  };
}

export function useTodoForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: '',
    dueDate: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: '',
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, setFormData, resetForm, updateField };
}
