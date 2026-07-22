import React, { useState } from 'react';
import {
  X,
  Mic,
  Battery,
  Wifi,
  Signal,
  Bell,
  Camera,
  MapPin,
  Calendar,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { UserProfile, TaskItem, CalendarEvent } from '../types';

interface MobileSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  tasks: TaskItem[];
  calendarEvents: CalendarEvent[];
  onOpenVoiceModal: () => void;
}

export const MobileSimulatorModal: React.FC<MobileSimulatorModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  tasks,
  calendarEvents,
  onOpenVoiceModal,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'notifications' | 'location'>('home');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
      <div className="relative flex flex-col items-center">
        {/* Close Button Outside Frame */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Smartphone Hardware Frame */}
        <div className="relative w-[340px] h-[680px] rounded-[48px] bg-slate-950 border-[10px] border-slate-800 shadow-2xl shadow-cyan-950/90 flex flex-col overflow-hidden text-slate-100 font-sans">
          {/* Top Notch / Camera Pill */}
          <div className="w-full h-8 bg-slate-950 flex items-center justify-between px-6 pt-2 text-[10px] font-mono text-slate-400 z-20">
            <span>09:41</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Mobile Screen Body */}
          <div className="flex-1 bg-gradient-to-b from-slate-900/90 via-slate-950 to-indigo-950/80 p-4 space-y-4 overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-widest">
                  FRIDAY MOBILE OS
                </span>
                <h2 className="text-base font-bold text-white">Hi, {userProfile.callSign}</h2>
              </div>
              <div className="p-2 rounded-full bg-white/10 border border-white/10 text-sky-300 backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Floating Mobile Voice Widget */}
            <div
              onClick={() => {
                onClose();
                onOpenVoiceModal();
              }}
              className="p-4 rounded-3xl bg-gradient-to-tr from-sky-500/20 to-indigo-600/20 border border-sky-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between cursor-pointer hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white">Tap to speak FRIDAY</h3>
                  <p className="text-[10px] font-mono text-sky-300">Listening for "Hey Friday"</p>
                </div>
              </div>
            </div>

            {/* Mobile Task Widget */}
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-bold">TODAY'S TASKS</span>
                <span className="text-sky-400">{tasks.filter((t) => !t.completed).length} Pending</span>
              </div>
              <div className="space-y-1.5">
                {tasks.slice(0, 2).map((t) => (
                  <div key={t.id} className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-mono text-slate-200 flex items-center justify-between backdrop-blur-md">
                    <span className="truncate">{t.title}</span>
                    <span className="text-[9px] text-sky-400">{t.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Calendar Widget */}
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-bold">UPCOMING AGENDA</span>
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              {calendarEvents.slice(0, 1).map((evt) => (
                <div key={evt.id} className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-mono text-slate-200 backdrop-blur-md">
                  <p className="font-bold text-white">{evt.title}</p>
                  <p className="text-[10px] text-sky-400">{evt.startTime} - {evt.endTime}</p>
                </div>
              ))}
            </div>

            {/* Mobile Location / Routine */}
            <div className="p-3.5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span className="text-slate-200">San Francisco, CA</span>
              </div>
              <span className="text-[10px] text-emerald-400">GPS Sync Active</span>
            </div>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-full h-6 bg-slate-950 flex items-center justify-center">
            <div className="w-32 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
