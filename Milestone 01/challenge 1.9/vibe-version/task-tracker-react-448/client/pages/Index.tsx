import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: input.trim(),
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Task Manager
          </h1>
          <p className="text-lg text-slate-500">
            Stay organized and productive with your personal task list
          </p>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task..."
              className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400 bg-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
              aria-label="Add task"
            >
              <Plus size={20} />
            </button>
          </div>
        </form>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-lg w-fit">
          {(
            [
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "completed", label: "Completed" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterType)}
              className={`px-5 py-2 rounded-md font-medium transition-all ${
                filter === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-slate-600 text-sm mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-slate-900">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-slate-600 text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-blue-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-slate-600 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Check className="text-slate-400" size={32} />
              </div>
              <p className="text-slate-500 text-lg">
                {tasks.length === 0
                  ? "No tasks yet. Add one to get started!"
                  : `No ${filter} tasks`}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 bg-white rounded-lg p-4 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? "bg-green-500 border-green-500"
                      : "border-slate-300 hover:border-blue-400"
                  }`}
                >
                  {task.completed && <Check size={16} className="text-white" />}
                </button>
                <span
                  className={`flex-1 text-lg transition-all ${
                    task.completed
                      ? "text-slate-400 line-through"
                      : "text-slate-800"
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        {tasks.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-slate-500 text-sm">
              {completedCount === tasks.length && tasks.length > 0
                ? "🎉 All tasks completed! Great work!"
                : `${activeCount} ${activeCount === 1 ? "task" : "tasks"} remaining`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
