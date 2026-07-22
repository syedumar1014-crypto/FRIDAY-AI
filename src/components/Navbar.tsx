import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Mic,
  Volume2,
  VolumeX,
  Smartphone,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  Bot,
  Terminal,
  Eye,
  Database,
  Download,
  Monitor,
} from 'lucide-react';
import { UserProfile, SystemStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  systemStatus: SystemStatus;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenVoiceModal: () => void;
  onOpenMobileSim: () => void;
  onOpenWinDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  systemStatus,
  soundEnabled,
  setSoundEnabled,
  onOpenVoiceModal,
  onOpenMobileSim,
  onOpenWinDownload,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Clock with timezone formatting
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const timeFormatted = new Intl.DateTimeFormat('en-US', {
          timeZone: userProfile.timezone || 'America/Los_Angeles',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now);

        const dateFormatted = new Intl.DateTimeFormat('en-US', {
          timeZone: userProfile.timezone || 'America/Los_Angeles',
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(now);

        setTimeStr(timeFormatted);
        setDateStr(dateFormatted);
      } catch (e) {
        setTimeStr(now.toLocaleTimeString());
        setDateStr(now.toLocaleDateString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [userProfile.timezone]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'automation', label: 'Automation OS', icon: Terminal },
    { id: 'vision', label: 'Vision AI', icon: Eye },
    { id: 'memory', label: 'Vector Memory', icon: Database },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/5 border-b border-white/10 backdrop-blur-xl text-slate-100 shadow-2xl shadow-sky-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Status Row */}
        <div className="flex items-center justify-between h-16 border-b border-white/10">
          {/* Logo & Call Sign */}
          <div className="flex items-center gap-3">
            <div
              onClick={onOpenVoiceModal}
              className="relative cursor-pointer group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 border border-white/20 hover:border-sky-300 transition-all shadow-lg shadow-sky-500/20"
            >
              <span className="font-extrabold text-white text-lg tracking-tighter">F</span>
              <div className="absolute inset-0 rounded-xl border border-white/30 group-hover:scale-105 transition-transform" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 text-lg">
                  FRIDAY AI
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-sky-400 border border-white/10 font-semibold tracking-widest uppercase backdrop-blur-md">
                  System Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span>Welcome back, <strong className="text-sky-300">{userProfile.callSign}</strong></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{userProfile.name}</span>
              </p>
            </div>
          </div>

          {/* Center Time & Timezone Badge */}
          <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-right">
              <div className="text-xs font-mono font-bold tracking-widest text-sky-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                {timeStr}
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {dateStr} ({userProfile.timezone.split('/')[1]?.replace('_', ' ') || userProfile.timezone})
            </div>
          </div>

          {/* Right Status Indicators & Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Health & Latency Pill */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5 text-sky-400" title="Neural Processing Latency">
                <Activity className="w-3.5 h-3.5" />
                <span>{systemStatus.neuralLatencyMs}ms</span>
              </div>
              <span className="text-white/10">|</span>
              <div className="flex items-center gap-1.5 text-emerald-400" title="CPU Load">
                <Cpu className="w-3.5 h-3.5" />
                <span>{systemStatus.cpuLoad}%</span>
              </div>
              <span className="text-white/10">|</span>
              <div className="flex items-center gap-1.5 text-indigo-400" title="Security Status">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SECURED</span>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute HUD Sound Effects' : 'Enable HUD Sound Effects'}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all text-sm ${
                soundEnabled
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-300 hover:bg-sky-500/20'
                  : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Voice Assistant Launcher */}
            <button
              onClick={onOpenVoiceModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Mic className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline font-mono tracking-wide">HEY FRIDAY</span>
            </button>

            {/* Download Windows .exe Button */}
            <button
              onClick={onOpenWinDownload}
              title="Download & Package for Windows PC (.exe)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-sky-300 font-mono text-xs font-bold transition-all backdrop-blur-md"
            >
              <Monitor className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xl:inline">WIN .EXE</span>
            </button>

            {/* Mobile Simulator Mode Launcher */}
            <button
              onClick={onOpenMobileSim}
              title="Open Mobile OS Simulator"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-sky-400 hover:border-white/20 transition-all backdrop-blur-md"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium text-xs tracking-wide transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30 backdrop-blur-md shadow-lg shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
