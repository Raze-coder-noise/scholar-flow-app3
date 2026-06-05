'use client';

import { useState } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { useTodoFilters, useTodoStats, type TodoFilter } from '@/hooks/useTodo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TodoItem } from '@/components/TodoItem';
import { TodoForm } from '@/components/TodoForm';
import { CheckCircle2, Circle, Trash2, BarChart3, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TodoPage() {
  const [filter, setFilter] = useState<TodoFilter>({
    status: 'all',
    priority: 'all',
    category: 'all',
    searchQuery: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const todos = useTodoStore((state) => state.todos);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const filteredTodos = useTodoFilters(filter);
  const stats = useTodoStats();

  const categories = Array.from(new Set(todos.filter((t) => t.category).map((t) => t.category)));

  const handleClearCompleted = () => {
    if (stats.completed === 0) {
      toast.error('No completed todos to clear');
      return;
    }
    clearCompleted();
    toast.success(`Cleared ${stats.completed} completed todo(s)`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">📝 Todo List</h1>
            <p className="text-sm text-slate-500 mt-1">Stay organized and track your tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="rounded-2xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid md:grid-cols-4 gap-6">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-slate-500">Total Todos</p>
                <Circle className="w-5 h-5 text-slate-400" />
              </div>
              <div className="text-4xl font-bold">{stats.total}</div>
              <p className="text-xs text-slate-500 mt-2">All tasks</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-slate-500">Active</p>
                <Circle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-4xl font-bold text-amber-600">{stats.active}</div>
              <p className="text-xs text-slate-500 mt-2">In progress</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-slate-500">Completed</p>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-slate-500 mt-2">Done</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-slate-500">Completion Rate</p>
                <BarChart3 className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="text-4xl font-bold text-cyan-600">{stats.completionRate}%</div>
              <p className="text-xs text-slate-500 mt-2">Progress</p>
            </CardContent>
          </Card>
        </section>

        {/* Filters Section */}
        {showFilters && (
          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search
                  </label>
                  <Input
                    type="text"
                    value={filter.searchQuery || ''}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))
                    }
                    placeholder="Search todos..."
                    className="rounded-2xl"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filter.status || 'all'}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        status: e.target.value as 'all' | 'active' | 'completed',
                      }))
                    }
                    className="w-full px-4 py-2 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={filter.priority || 'all'}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        priority: e.target.value as 'all' | 'low' | 'medium' | 'high',
                      }))
                    }
                    className="w-full px-4 py-2 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filter.category || 'all'}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <Button
                onClick={() =>
                  setFilter({
                    status: 'all',
                    priority: 'all',
                    category: 'all',
                    searchQuery: '',
                  })
                }
                variant="outline"
                className="rounded-2xl"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <section className="grid lg:grid-cols-3 gap-6">
          {/* Todo Form */}
          <div className="lg:col-span-1">
            <TodoForm />
          </div>

          {/* Todo List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {filteredTodos.length} {filteredTodos.length === 1 ? 'Todo' : 'Todos'}
              </h2>
              {stats.completed > 0 && (
                <Button
                  onClick={handleClearCompleted}
                  variant="ghost"
                  className="rounded-2xl text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Completed
                </Button>
              )}
            </div>

            {filteredTodos.length === 0 ? (
              <Card className="rounded-3xl shadow-sm">
                <CardContent className="p-12 text-center">
                  <Circle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    No todos yet
                  </h3>
                  <p className="text-slate-500">
                    {todos.length > 0
                      ? 'No todos match your filters'
                      : 'Create your first todo to get started!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <TodoItem key={todo.id} todoId={todo.id} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
