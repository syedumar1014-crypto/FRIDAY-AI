import React, { useState } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  Sparkles,
  Tag,
  CheckCircle2,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { MemoryItem } from '../../types';

interface MemoryTabProps {
  memories: MemoryItem[];
  setMemories: React.Dispatch<React.SetStateAction<MemoryItem[]>>;
}

export const MemoryTab: React.FC<MemoryTabProps> = ({ memories, setMemories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MemoryItem[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form for new memory
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<'preference' | 'fact' | 'goal' | 'habit' | 'project' | 'event'>('fact');
  const [newImportance, setNewImportance] = useState<'high' | 'medium' | 'low'>('medium');

  // Perform vector semantic search
  const handleVectorSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch('/api/friday/memory-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, memories }),
      });
      const data = await res.json();
      setSearchResults(data.relevantMemories || []);
    } catch (e) {
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  // Add memory
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    const item: MemoryItem = {
      id: `mem-${Date.now()}`,
      category: newCategory,
      key: newKey.trim(),
      value: newValue.trim(),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      importance: newImportance,
      vectorEmbedded: true,
    };

    setMemories((prev) => [item, ...prev]);
    setNewKey('');
    setNewValue('');
  };

  // Delete memory
  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const displayedMemories = (searchResults || memories).filter((m) =>
    selectedCategory === 'all' ? true : m.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-mono text-white tracking-wide">
              LONG-TERM VECTOR MEMORY MATRIX
            </h1>
            <p className="text-xs font-mono text-slate-400">
              FRIDAY AI recalls user preferences, goals, habits, and project contexts using vector embeddings.
            </p>
          </div>
        </div>
      </div>

      {/* Semantic Search & Add Memory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Search & Memory Matrix Display */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vector Search Bar */}
          <form onSubmit={handleVectorSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value.trim()) setSearchResults(null);
                }}
                placeholder="Perform semantic vector recall search..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 backdrop-blur-md"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-sky-500/20"
            >
              {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>SEARCH</span>}
            </button>
          </form>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
            {['all', 'preference', 'fact', 'goal', 'habit', 'project', 'event'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border transition-all uppercase whitespace-nowrap backdrop-blur-md ${
                  selectedCategory === cat
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Memory List */}
          <div className="space-y-3">
            {displayedMemories.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-slate-500 backdrop-blur-md">
                No memories match query or selected category.
              </div>
            ) : (
              displayedMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md flex items-start justify-between gap-4 hover:border-white/20 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono font-bold uppercase">
                        {mem.category}
                      </span>
                      <h3 className="text-xs font-mono font-bold text-white">{mem.key}</h3>
                      {mem.vectorEmbedded && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Embedded</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-300">{mem.value}</p>
                    <p className="text-[10px] font-mono text-slate-500">{mem.timestamp}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(mem.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Add New Memory Form */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-sky-400" />
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-sky-400">STORE NEW MEMORY</h2>
          </div>

          <form onSubmit={handleAddMemory} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Memory Title / Key</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. Favorite Coding Paradigm"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-sky-500/50 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Memory Detail / Value</label>
              <textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g. User prefers functional TypeScript with React 19..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-sky-500/50 backdrop-blur-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                >
                  <option value="preference">Preference</option>
                  <option value="fact">Fact</option>
                  <option value="goal">Goal</option>
                  <option value="habit">Habit</option>
                  <option value="project">Project</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Importance</label>
                <select
                  value={newImportance}
                  onChange={(e: any) => setNewImportance(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-sky-500/20"
            >
              <Database className="w-4 h-4" />
              <span>INDEX MEMORY VECTOR</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
