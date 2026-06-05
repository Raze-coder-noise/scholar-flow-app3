import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  getTodoById: (id: string) => Todo | undefined;
  getTodosByCategory: (category: string) => Todo[];
  getTodosByPriority: (priority: 'low' | 'medium' | 'high') => Todo[];
  getCompletedTodos: () => Todo[];
  getActiveTodos: () => Todo[];
  clearCompleted: () => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const getCurrentTimestamp = () => new Date().toISOString();

export const useTodoStore = create<TodoStore>(
  persist(
    (set, get) => ({
      todos: [],

      addTodo: (todo) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...todo,
              id: generateId(),
              createdAt: getCurrentTimestamp(),
              updatedAt: getCurrentTimestamp(),
            },
          ],
        })),

      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, ...updates, updatedAt: getCurrentTimestamp() }
              : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: getCurrentTimestamp() }
              : todo
          ),
        })),

      getTodoById: (id) => get().todos.find((todo) => todo.id === id),

      getTodosByCategory: (category) =>
        get().todos.filter((todo) => todo.category === category),

      getTodosByPriority: (priority) =>
        get().todos.filter((todo) => todo.priority === priority),

      getCompletedTodos: () => get().todos.filter((todo) => todo.completed),

      getActiveTodos: () => get().todos.filter((todo) => !todo.completed),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),
    }),
    {
      name: 'todo-storage',
      storage: typeof window !== 'undefined'
        ? {
            getItem: (name) => {
              const item = localStorage.getItem(name);
              return item ? JSON.parse(item) : null;
            },
            setItem: (name, value) => {
              localStorage.setItem(name, JSON.stringify(value));
            },
            removeItem: (name) => {
              localStorage.removeItem(name);
            },
          }
        : undefined,
    }
  )
);
