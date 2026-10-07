import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, ListChecks } from 'lucide-react';
import { TodoItem } from '../types/dashboard';

const STORAGE_KEY = 'schooldashboard_todos';

export const TodoListWidget: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: '1', text: 'Sortir les cahiers du jour', completed: false, createdAt: Date.now() },
      { id: '2', text: 'Exercices p. 42 (n° 1 à 4)', completed: false, createdAt: Date.now() + 1 },
      { id: '3', text: 'Noter les devoirs dans l’agenda', completed: false, createdAt: Date.now() + 2 },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputVal('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const remainingCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-col h-full select-none">
      {/* Input Form */}
      <form onSubmit={addTodo} className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Nouvelle consigne / tâche..."
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center font-bold"
          title="Ajouter"
        >
          <Plus size={16} />
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between text-xs mb-2 px-1">
        <div className="flex gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Toutes ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              filter === 'active' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            En cours ({remainingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              filter === 'completed' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Faites
          </button>
        </div>

        {todos.some((t) => t.completed) && (
          <button
            onClick={clearCompleted}
            className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
          >
            Effacer finies
          </button>
        )}
      </div>

      {/* Todo Items List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-[100px]">
        {filteredTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-6">
            <ListChecks size={28} className="opacity-30 mb-1" />
            <span className="text-xs">Aucune tâche dans cette liste</span>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                todo.completed
                  ? 'bg-white/5 border-white/5 text-slate-400'
                  : 'bg-white/10 border-white/10 hover:border-white/20 text-white'
              }`}
            >
              <div
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'border-white/40 hover:border-cyan-400'
                  }`}
                >
                  {todo.completed && <Check size={12} strokeWidth={3} />}
                </div>
                <span
                  className={`text-sm truncate select-none ${
                    todo.completed ? 'line-through text-slate-400' : 'text-white'
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-slate-400 hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity ml-2"
                title="Supprimer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
