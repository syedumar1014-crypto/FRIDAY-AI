import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  Activity,
  Zap,
  ShieldCheck,
  RefreshCw,
  Sliders,
  TrendingUp,
  Maximize2,
  AlertCircle,
  Database,
  Gauge,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { SystemStatus } from '../types';

interface SystemPerformanceWidgetProps {
  systemStatus: SystemStatus;
}

interface TelemetryPoint {
  time: string;
  cpu: number;
  ram: number;
  disk: number;
  latency: number;
}

export const SystemPerformanceWidget: React.FC<SystemPerformanceWidgetProps> = ({
  systemStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cpu' | 'ram' | 'disk'>('overview');
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optMessage, setOptMessage] = useState<string | null>(null);

  // Initialize and update rolling history when systemStatus changes or on interval
  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newPoint: TelemetryPoint = {
      time: timeStr,
      cpu: Math.min(100, Math.max(5, systemStatus.cpuLoad)),
      ram: Math.min(100, Math.max(10, systemStatus.memoryUsage)),
      disk: Math.min(100, Math.max(15, systemStatus.diskUsage ?? 42)),
      latency: systemStatus.neuralLatencyMs,
    };

    setHistory((prev) => {
      // Keep last 15 data points
      if (prev.length === 0) {
        // seed with 6 initial points leading up to now
        const seeded: TelemetryPoint[] = [];
        for (let i = 5; i >= 0; i--) {
          const t = new Date(now.getTime() - i * 4000);
          const tStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const jitter = (Math.sin(i) * 6);
          seeded.push({
            time: tStr,
            cpu: Math.min(100, Math.max(10, Math.round(newPoint.cpu + jitter))),
            ram: Math.min(100, Math.max(15, Math.round(newPoint.ram + jitter * 0.5))),
            disk: newPoint.disk,
            latency: Math.max(10, Math.round(newPoint.latency + jitter * 2)),
          });
        }
        return seeded;
      }

      const updated = [...prev, newPoint];
      return updated.slice(-15);
    });
  }, [systemStatus]);

  // Periodic subtle fluctuation to make graphs feel live and dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setHistory((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        // small organic variation
        const cpuVar = Math.min(95, Math.max(8, last.cpu + (Math.random() * 8 - 4)));
        const ramVar = Math.min(95, Math.max(20, last.ram + (Math.random() * 4 - 2)));
        const diskVar = last.disk; // Disk remains steady
        const latVar = Math.min(120, Math.max(15, last.latency + (Math.random() * 6 - 3)));

        const nextPoint: TelemetryPoint = {
          time: timeStr,
          cpu: Math.round(cpuVar),
          ram: Math.round(ramVar),
          disk: Math.round(diskVar),
          latency: Math.round(latVar),
        };

        return [...prev.slice(-14), nextPoint];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Run Memory / CPU Optimization Simulation
  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptMessage('Flushing process heap & optimizing neural pathways...');

    setTimeout(() => {
      setHistory((prev) =>
        prev.map((p, idx) =>
          idx === prev.length - 1
            ? { ...p, cpu: Math.max(8, p.cpu - 12), ram: Math.max(22, p.ram - 8) }
            : p
        )
      );
      setIsOptimizing(false);
      setOptMessage('Optimization complete: +1.4 GB RAM Freed, CPU Load throttled down.');
      setTimeout(() => setOptMessage(null), 4000);
    }, 1200);
  };

  const currentCpu = history.length > 0 ? history[history.length - 1].cpu : systemStatus.cpuLoad;
  const currentRam = history.length > 0 ? history[history.length - 1].ram : systemStatus.memoryUsage;
  const currentDisk = systemStatus.diskUsage ?? 42;
  const currentLatency = history.length > 0 ? history[history.length - 1].latency : systemStatus.neuralLatencyMs;

  // Custom Glassmorphism Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-md font-mono text-xs shadow-xl space-y-1">
          <p className="text-[10px] text-slate-400 font-bold border-b border-white/10 pb-1 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="capitalize">{entry.name}:</span>
              </span>
              <span className="font-bold text-white">
                {entry.value}
                {entry.name === 'latency' ? ' ms' : '%'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-inner">
            <Gauge className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                HARDWARE HEALTH: OPTIMAL
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {systemStatus.activeThreads} THREADS // {systemStatus.uptimeSeconds}s UPTIME
              </span>
            </div>
            <h2 className="text-sm font-bold font-mono text-white tracking-wide mt-0.5">
              REAL-TIME SYSTEM PERFORMANCE MONITOR
            </h2>
          </div>
        </div>

        {/* View Tabs & Action Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex p-1 rounded-2xl bg-black/30 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('cpu')}
              className={`px-3 py-1 rounded-xl transition-all ${
                activeTab === 'cpu'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CPU
            </button>
            <button
              onClick={() => setActiveTab('ram')}
              className={`px-3 py-1 rounded-xl transition-all ${
                activeTab === 'ram'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RAM
            </button>
            <button
              onClick={() => setActiveTab('disk')}
              className={`px-3 py-1 rounded-xl transition-all ${
                activeTab === 'disk'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DISK
            </button>
          </div>

          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-600/20 hover:from-sky-500/30 hover:to-indigo-600/30 border border-sky-500/30 text-sky-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing...' : 'Flush RAM'}</span>
          </button>
        </div>
      </div>

      {/* Optimization Notification Banner */}
      {optMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{optMessage}</span>
        </div>
      )}

      {/* Telemetry Quick Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">CPU Utilization</p>
              <p className="text-sm font-bold text-sky-300">{currentCpu}%</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">12 Cores</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">RAM Usage</p>
              <p className="text-sm font-bold text-indigo-300">{currentRam}%</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">16/32 GB</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Disk Storage</p>
              <p className="text-sm font-bold text-purple-300">{currentDisk}%</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">215/512 GB</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Neural Latency</p>
              <p className="text-sm font-bold text-emerald-300">{currentLatency} ms</p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400">Low Jitter</span>
        </div>
      </div>

      {/* Main Recharts Telemetry Chart Area */}
      <div className="h-64 w-full bg-black/20 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="diskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              domain={[0, 100]}
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />

            {(activeTab === 'overview' || activeTab === 'cpu') && (
              <Area
                type="monotone"
                dataKey="cpu"
                name="CPU"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cpuGradient)"
              />
            )}

            {(activeTab === 'overview' || activeTab === 'ram') && (
              <Area
                type="monotone"
                dataKey="ram"
                name="RAM"
                stroke="#818cf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ramGradient)"
              />
            )}

            {(activeTab === 'overview' || activeTab === 'disk') && (
              <Area
                type="monotone"
                dataKey="disk"
                name="Disk"
                stroke="#c084fc"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#diskGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subsystem Telemetry Details Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>CPU: Intel Core i9-14900K @ 3.20GHz</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>RAM: DDR5 6000MHz Dual-Channel</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span>Storage: NVMe PCIe 4.0 x4 SSD (Health 99%)</span>
        </div>
      </div>
    </div>
  );
};
