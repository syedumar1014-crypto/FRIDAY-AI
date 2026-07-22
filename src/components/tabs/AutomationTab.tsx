import React, { useState } from 'react';
import {
  Terminal,
  Play,
  PlayCircle,
  Folder,
  Layers,
  Cpu,
  Monitor,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Code2,
  Globe,
  Music,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { AutomatedWorkflow } from '../../types';

interface AutomationTabProps {
  workflows: AutomatedWorkflow[];
}

export const AutomationTab: React.FC<AutomationTabProps> = ({ workflows }) => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'FRIDAY OS AUTOMATION SHELL [v2.5.0-NEURAL]',
    'Connected to local system control daemon (PID 1024).',
    'Type "help" or select a workflow playbook below to execute.',
  ]);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [executingWfId, setExecutingWfId] = useState<string | null>(null);

  // App Launcher Items
  const apps = [
    { id: 'vscode', name: 'VS Code IDE', icon: Code2, status: 'Active Workspace' },
    { id: 'browser', name: 'Web Browser', icon: Globe, status: 'Port 3000 Open' },
    { id: 'notes', name: 'FRIDAY Notes', icon: FileText, status: 'Synced' },
    { id: 'media', name: 'Neural Synthesizer', icon: Music, status: 'Idle' },
  ];

  // Execute terminal command
  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalInput('');
    setTerminalLogs((prev) => [...prev, `$ ${cmd}`]);

    try {
      const res = await fetch('/api/friday/automation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      if (data.logs) {
        setTerminalLogs((prev) => [...prev, ...data.logs]);
      }
    } catch (e: any) {
      setTerminalLogs((prev) => [...prev, `[ERROR] Execution failed: ${e.message}`]);
    }
  };

  // Launch simulated app
  const launchApp = async (appName: string) => {
    setActiveApp(appName);
    setTerminalLogs((prev) => [...prev, `[SYSTEM_OS] Requesting process start for: ${appName}`]);
    try {
      const res = await fetch('/api/friday/automation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetApp: appName }),
      });
      const data = await res.json();
      if (data.logs) {
        setTerminalLogs((prev) => [...prev, ...data.logs]);
      }
    } catch (e: any) {
      setTerminalLogs((prev) => [...prev, `[ERROR] App launcher failed: ${e.message}`]);
    }
  };

  // Run macro workflow playbook
  const runWorkflow = async (wf: AutomatedWorkflow) => {
    setExecutingWfId(wf.id);
    setTerminalLogs((prev) => [...prev, `[MACRO] Initiating playbook: ${wf.name}`]);

    try {
      const res = await fetch('/api/friday/automation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: wf.id }),
      });
      const data = await res.json();
      if (data.logs) {
        setTerminalLogs((prev) => [...prev, ...data.logs]);
      }
    } catch (e: any) {
      setTerminalLogs((prev) => [...prev, `[ERROR] Workflow failed: ${e.message}`]);
    } finally {
      setTimeout(() => setExecutingWfId(null), 1000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-mono text-white tracking-wide">
              COMPUTER AUTOMATION & MACROS
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Control application processes, execute Python/Bash automation CLI scripts, and trigger automated macro workflows.
            </p>
          </div>
        </div>
      </div>

      {/* App Launcher Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {apps.map((app) => {
          const Icon = app.icon;
          const isRunning = activeApp === app.name;
          return (
            <button
              key={app.id}
              onClick={() => launchApp(app.name)}
              className={`p-4 rounded-3xl border text-left transition-all flex items-center gap-3 backdrop-blur-xl ${
                isRunning
                  ? 'bg-sky-500/10 border-sky-500/30 text-white shadow-lg shadow-sky-500/10'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-white/10 text-sky-400 border border-white/10">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-xs">{app.name}</h3>
                <p className="text-[10px] font-mono text-slate-500">{app.status}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Split: Interactive Terminal & Macro Playbooks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CLI Terminal */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 flex flex-col h-[480px] shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Monitor className="w-4 h-4" />
              <span>FRIDAY AUTOMATION TERMINAL</span>
            </div>
            <button
              onClick={() => setTerminalLogs(['FRIDAY OS AUTOMATION SHELL [v2.5.0-NEURAL]'])}
              className="text-slate-500 hover:text-slate-300 text-[10px]"
            >
              Clear Log
            </button>
          </div>

          {/* Terminal Screen Output */}
          <div className="flex-1 my-3 overflow-y-auto space-y-1.5 font-mono text-xs text-sky-300/90 leading-relaxed scrollbar-none">
            {terminalLogs.map((log, index) => (
              <p
                key={index}
                className={
                  log.startsWith('$')
                    ? 'text-white font-bold'
                    : log.includes('ERROR')
                    ? 'text-rose-400'
                    : log.includes('SUCCESS')
                    ? 'text-emerald-400'
                    : 'text-sky-300/80'
                }
              >
                {log}
              </p>
            ))}
          </div>

          {/* CLI Input Form */}
          <form onSubmit={handleTerminalSubmit} className="flex gap-2 pt-2 border-t border-white/10">
            <span className="text-sky-400 font-mono font-bold text-sm py-2">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="e.g. status, run friday-diagnostics, help..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/50"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-mono text-xs font-bold"
            >
              Run
            </button>
          </form>
        </div>

        {/* Macro Playbooks */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">
                AUTOMATED WORKFLOW PLAYBOOKS
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {workflows.map((wf) => {
              const isExecuting = executingWfId === wf.id;
              return (
                <div
                  key={wf.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-mono font-bold text-sm text-slate-100">{wf.name}</h3>
                      <p className="text-xs font-mono text-slate-400 mt-1">{wf.description}</p>
                    </div>

                    <button
                      onClick={() => runWorkflow(wf)}
                      disabled={isExecuting}
                      className="px-4 py-2 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                    >
                      {isExecuting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>{isExecuting ? 'Running...' : 'Execute'}</span>
                    </button>
                  </div>

                  {/* Steps Breakdown */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Playbook Execution Steps:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {wf.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-sky-400" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
