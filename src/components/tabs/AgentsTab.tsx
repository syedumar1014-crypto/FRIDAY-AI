import React, { useState } from 'react';
import {
  Bot,
  Search,
  Code,
  BookOpen,
  CheckSquare,
  UserCheck,
  Send,
  Sparkles,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';
import { AgentInfo, AgentType, ChatMessage } from '../../types';

interface AgentsTabProps {
  agents: AgentInfo[];
  onSendMessage: (text: string, agent?: string) => Promise<ChatMessage | null>;
}

export const AgentsTab: React.FC<AgentsTabProps> = ({ agents, onSendMessage }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('research');
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentOutputs, setAgentOutputs] = useState<Record<AgentType, ChatMessage[]>>({
    research: [],
    coding: [],
    study: [],
    productivity: [],
    assistant: [],
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeAgent = agents.find((a) => a.id === selectedAgent) || agents[0];

  const agentIcons: Record<AgentType, any> = {
    research: Search,
    coding: Code,
    study: BookOpen,
    productivity: CheckSquare,
    assistant: UserCheck,
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || loading) return;

    const query = promptInput;
    setPromptInput('');
    setLoading(true);

    const response = await onSendMessage(query, selectedAgent);
    if (response) {
      setAgentOutputs((prev) => ({
        ...prev,
        [selectedAgent]: [response, ...(prev[selectedAgent] || [])],
      }));
    }
    setLoading(false);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const agentPresetPrompts: Record<AgentType, string[]> = {
    research: [
      'Investigate quantum neural networks and synthesize key takeaways',
      'Conduct a comparative study of Gemini 3 vs legacy LLMs',
      'Research best practices for vector database memory indexing',
    ],
    coding: [
      'Write a Python script to automate file directory organization',
      'Implement an Express.js API route proxying Gemini 3.6 Flash calls',
      'Refactor a React 19 component using custom hooks and TypeScript',
    ],
    study: [
      'Generate 5 flashcards for Machine Learning transformer architectures',
      'Create a 30-minute practice quiz on Data Structures & Algorithms',
      'Summarize key principles of distributed systems engineering',
    ],
    productivity: [
      'Break down building a personal AI OS into 5 actionable milestones',
      'Construct a daily Eisenhower Matrix for deep work focus',
      'Design a 50-10 Pomodoro focus protocol schedule',
    ],
    assistant: [
      'Draft a polite executive reply confirming Q3 roadmap approval',
      'Generate a structured summary of my morning priorities',
      'Coordinate calendar meeting invites for FRIDAY system review',
    ],
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-mono text-white tracking-wide">
              FRIDAY SPECIALIZED AGENT HUB
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Deploy specialized AI agent instances fine-tuned for research, coding, study, productivity, and executive support.
            </p>
          </div>
        </div>
      </div>

      {/* Agent Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {agents.map((ag) => {
          const Icon = agentIcons[ag.id] || Bot;
          const isSelected = selectedAgent === ag.id;
          return (
            <button
              key={ag.id}
              onClick={() => setSelectedAgent(ag.id)}
              className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between h-32 backdrop-blur-xl ${
                isSelected
                  ? 'bg-sky-500/10 border-sky-500/30 text-white shadow-lg shadow-sky-500/10 scale-[1.02]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-100 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl text-white bg-gradient-to-br ${ag.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                )}
              </div>

              <div>
                <h3 className="font-mono font-bold text-xs text-slate-100">{ag.name}</h3>
                <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{ag.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Agent Terminal Workspace */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
        {/* Agent Persona Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono font-bold uppercase">
                ACTIVE AGENT
              </span>
              <h2 className="text-xl font-bold font-mono text-white">{activeAgent.name}</h2>
            </div>
            <p className="text-xs font-mono text-slate-300 mt-1">{activeAgent.description}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeAgent.capabilities.map((cap, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-white/5 text-slate-300 border border-white/10 text-[10px] font-mono"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Preset Prompts */}
        <div className="space-y-2">
          <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Recommended Agent Workflows:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {(agentPresetPrompts[selectedAgent] || []).map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setPromptInput(preset)}
                className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-sky-300 transition-all text-left backdrop-blur-md"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleAgentSubmit} className="flex gap-2">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder={`Instruct ${activeAgent.name}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 backdrop-blur-md"
          />
          <button
            type="submit"
            disabled={!promptInput.trim() || loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 text-white font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
          >
            {loading ? (
              <span>PROCESSING...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>RUN</span>
              </>
            )}
          </button>
        </form>

        {/* Agent Outputs */}
        <div className="space-y-4 pt-2">
          <h3 className="font-mono text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
            {activeAgent.name} Output Stream
          </h3>

          {(agentOutputs[selectedAgent] || []).length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-slate-500 backdrop-blur-md">
              No recent outputs for {activeAgent.name}. Select a prompt or type an instruction above.
            </div>
          ) : (
            (agentOutputs[selectedAgent] || []).map((msg, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-mono text-xs leading-relaxed backdrop-blur-md"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/10 pb-2">
                  <span className="text-sky-400 font-bold">FRIDAY {activeAgent.name.toUpperCase()} RESULT</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="text-slate-200 whitespace-pre-wrap">{msg.text}</div>

                {/* Code Snippets handling */}
                {msg.codeSnippets?.map((snip, sIdx) => (
                  <div key={sIdx} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden mt-3">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 text-[10px] font-mono text-slate-400">
                      <span>{snip.language.toUpperCase()}</span>
                      <button
                        onClick={() => copyCode(snip.code, `${index}-${sIdx}`)}
                        className="flex items-center gap-1 text-sky-400 hover:text-sky-300"
                      >
                        {copiedId === `${index}-${sIdx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === `${index}-${sIdx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-3 text-[11px] text-sky-200 overflow-x-auto bg-black/30 font-mono">
                      {snip.code}
                    </pre>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
