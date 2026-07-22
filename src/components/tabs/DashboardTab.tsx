import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Calendar,
  CheckSquare,
  Bell,
  Sun,
  Zap,
  Plus,
  ArrowRight,
  Database,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  CalendarEvent,
  ChatMessage,
  MemoryItem,
  ReminderItem,
  SystemStatus,
  TaskItem,
  UserProfile,
  WeatherData,
} from '../../types';
import { AICoreOrb } from '../AICoreOrb';
import { SystemPerformanceWidget } from '../SystemPerformanceWidget';

interface DashboardTabProps {
  userProfile: UserProfile;
  systemStatus: SystemStatus;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  calendarEvents: CalendarEvent[];
  reminders: ReminderItem[];
  weather: WeatherData;
  memories: MemoryItem[];
  messages: ChatMessage[];
  onOpenVoiceModal: () => void;
  onSendMessage: (text: string, agent?: string) => Promise<ChatMessage | null>;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  userProfile,
  systemStatus,
  tasks,
  setTasks,
  calendarEvents,
  reminders,
  weather,
  memories,
  messages,
  onOpenVoiceModal,
  onSendMessage,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: 'work',
      dueDate: 'Today',
      completed: false,
      priority: 'high',
      tags: ['Personal'],
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  // Quick submit to FRIDAY
  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    const query = quickInput;
    setQuickInput('');
    onSendMessage(query, 'assistant');
    onOpenVoiceModal();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Hero Welcome & Orb Card */}
      <div className="relative rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Welcome Text & Quick Voice Command Prompt */}
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>System Online // Active Subsystems</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight">
              Good day, <span className="text-sky-300">{userProfile.callSign}</span>.
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              FRIDAY AI is actively monitoring your schedule, vector memory index ({systemStatus.vectorIndexCount} recalled units), and automated routines.
            </p>

            {/* Quick Prompt Bar */}
            <form onSubmit={handleQuickSubmit} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Ask FRIDAY or type a command..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 font-mono shadow-inner backdrop-blur-md"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs font-mono tracking-wide transition-all shadow-lg shadow-sky-500/20"
              >
                EXECUTE
              </button>
            </form>
          </div>

          {/* Interactive AI Core Orb */}
          <div className="flex flex-col items-center">
            <AICoreOrb
              aiState="idle"
              isListening={false}
              isSpeaking={false}
              onClick={onOpenVoiceModal}
              size="md"
            />
            <button
              onClick={onOpenVoiceModal}
              className="mt-2 text-xs font-mono text-sky-400 hover:text-sky-300 underline flex items-center gap-1"
            >
              <span>Tap for Voice Controls</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* System Status Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
            <span>NEURAL LOAD</span>
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{systemStatus.cpuLoad}%</div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full" style={{ width: `${systemStatus.cpuLoad}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
            <span>MEMORY USAGE</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300">{systemStatus.memoryUsage}%</div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${systemStatus.memoryUsage}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
            <span>LATENCY</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{systemStatus.neuralLatencyMs} ms</div>
          <p className="text-[10px] font-mono text-slate-500 mt-2">Gemini 3.6 Flash Route</p>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
            <span>VECTOR INDEX</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">{systemStatus.vectorIndexCount} units</div>
          <p className="text-[10px] font-mono text-slate-500 mt-2">Long-Term Memory Matrix</p>
        </div>
      </div>

      {/* Real-time System Performance Widget (Recharts) */}
      <SystemPerformanceWidget systemStatus={systemStatus} />

      {/* Main Grid: Tasks & Agenda / Weather & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority Tasks & Checklist (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Tasks Card */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-sky-400" />
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-sky-400 font-bold">
                  PRIORITY TASKS & WORKFLOW
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
              </span>
            </div>

            {/* Quick Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new goal or action item..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1 transition-all border border-white/10"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Task List */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-white/2 border-white/5 opacity-50 line-through'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-200">{task.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-400">
                      {task.dueDate}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-xl ${
                        task.priority === 'high'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Calendar Agenda */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">
                  TODAY'S CALENDAR AGENDA
                </h2>
              </div>
              <span className="text-xs font-mono text-sky-400">{userProfile.timezone}</span>
            </div>

            <div className="space-y-3">
              {calendarEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-10 rounded-full"
                      style={{ backgroundColor: evt.color }}
                    />
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white">{evt.title}</h3>
                      <p className="text-[10px] font-mono text-slate-400">{evt.location}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-sky-300">
                    {evt.startTime} - {evt.endTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weather & Active Reminders */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-sky-500/10 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Sun className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">LOCAL CLIMATE</span>
              </div>
              <span className="text-xs font-mono text-slate-400">{weather.city}</span>
            </div>

            <div className="flex items-baseline justify-between py-2">
              <div>
                <div className="text-4xl font-extrabold font-mono text-white">
                  {weather.tempF}°F <span className="text-lg font-normal text-slate-400">({weather.tempC}°C)</span>
                </div>
                <p className="text-xs font-mono text-sky-300 mt-1">{weather.condition}</p>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400 space-y-1">
                <p>Humidity: {weather.humidity}%</p>
                <p>Wind: {weather.windSpeed}</p>
              </div>
            </div>

            {/* Weather 5-Day Forecast */}
            <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-white/10 text-center font-mono">
              {weather.forecast.map((f, i) => (
                <div key={i} className="p-2 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-slate-400">{f.day}</p>
                  <p className="text-xs font-bold text-sky-300">{f.temp}°</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Reminders */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <Bell className="w-5 h-5" />
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-bold">ACTIVE REMINDERS</h2>
            </div>

            <div className="space-y-2">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rose-400" />
                    <div>
                      <p className="text-xs font-mono text-slate-200">{rem.title}</p>
                      <p className="text-[10px] font-mono text-slate-500">Repeat: {rem.repeat}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-rose-300 font-bold">{rem.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
