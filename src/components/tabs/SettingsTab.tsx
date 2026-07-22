import React, { useState } from 'react';
import {
  Settings,
  User,
  Globe,
  Clock,
  Mic,
  ShieldCheck,
  Save,
  Check,
  Activity,
  Lock,
} from 'lucide-react';
import { SecurityLog, UserProfile } from '../../types';

interface SettingsTabProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  securityLogs: SecurityLog[];
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  userProfile,
  setUserProfile,
  securityLogs,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [savedMessage, setSavedMessage] = useState(false);

  const timezones = [
    'America/Los_Angeles',
    'America/New_York',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Australia/Sydney',
  ];

  const voices = [
    { id: 'zephyr', name: 'Zephyr (Smooth Male Calm)' },
    { id: 'kore', name: 'Kore (Warm Female Executive)' },
    { id: 'puck', name: 'Puck (Energetic Dynamic)' },
    { id: 'fenrir', name: 'Fenrir (Deep Authority)' },
    { id: 'charon', name: 'Charon (Resonant Professional)' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({ ...formData });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-mono text-white tracking-wide">
              SYSTEM PERSONALIZATION & SECURITY
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Customize FRIDAY AI voice tone, timezone alignment, work routines, and inspect security audit logs.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personalization & Timezone Card */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <User className="w-4 h-4 text-sky-400" />
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-sky-400">USER PROFILE & TIMEZONE</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500/50 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Call Sign / Greeting</label>
                <input
                  type="text"
                  value={formData.callSign}
                  onChange={(e) => setFormData({ ...formData, callSign: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500/50 backdrop-blur-md"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">System Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Work Start Time</label>
                <input
                  type="time"
                  value={formData.workStartTime}
                  onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Work End Time</label>
                <input
                  type="time"
                  value={formData.workEndTime}
                  onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Daily Executive Goal</label>
              <input
                type="text"
                value={formData.dailyGoal}
                onChange={(e) => setFormData({ ...formData, dailyGoal: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500/50 backdrop-blur-md"
              />
            </div>
          </div>

          {/* Voice Assistant & Toggles Card */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Mic className="w-4 h-4 text-purple-400" />
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-400">VOICE SYNTHESIS & SYSTEM PREFERENCES</h2>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Gemini TTS Voice Preference</label>
              <select
                value={formData.voicePreference}
                onChange={(e: any) => setFormData({ ...formData, voicePreference: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer backdrop-blur-md">
                <span className="text-slate-200">Wake Word Detection ("Hey Friday")</span>
                <input
                  type="checkbox"
                  checked={formData.wakeWordEnabled}
                  onChange={(e) => setFormData({ ...formData, wakeWordEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 text-sky-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer backdrop-blur-md">
                <span className="text-slate-200">Continuous Listening Mode</span>
                <input
                  type="checkbox"
                  checked={formData.continuousListening}
                  onChange={(e) => setFormData({ ...formData, continuousListening: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 text-sky-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer backdrop-blur-md">
                <span className="text-slate-200">HUD Web Audio Synthesizer Effects</span>
                <input
                  type="checkbox"
                  checked={formData.soundEffects}
                  onChange={(e) => setFormData({ ...formData, soundEffects: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 text-sky-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Save Action Button */}
        <div className="flex items-center justify-between">
          {savedMessage && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>FRIDAY System parameters updated successfully.</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-8 py-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
          >
            <Save className="w-4 h-4" />
            <span>SAVE PARAMETERS</span>
          </button>
        </div>
      </form>

      {/* Security Audit Log */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400">SECURITY AUDIT & ACTIVITY LOGS</h2>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {securityLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] uppercase font-bold">
                    {log.status}
                  </span>
                  <h3 className="font-bold text-white">{log.event}</h3>
                </div>
                <p className="text-slate-300 mt-1">{log.details}</p>
              </div>

              <span className="text-[10px] text-slate-500 whitespace-nowrap">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
