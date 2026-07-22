/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/tabs/DashboardTab';
import { AgentsTab } from './components/tabs/AgentsTab';
import { AutomationTab } from './components/tabs/AutomationTab';
import { VisionTab } from './components/tabs/VisionTab';
import { MemoryTab } from './components/tabs/MemoryTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { MobileSimulatorModal } from './components/MobileSimulatorModal';
import { WinDownloadModal } from './components/WinDownloadModal';
import {
  INITIAL_USER_PROFILE,
  INITIAL_SYSTEM_STATUS,
  INITIAL_AGENTS,
  INITIAL_MEMORIES,
  INITIAL_TASKS,
  INITIAL_CALENDAR,
  INITIAL_REMINDERS,
  INITIAL_WORKFLOWS,
  INITIAL_WEATHER,
  INITIAL_SECURITY_LOGS,
} from './data/initialData';
import { ChatMessage } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [systemStatus, setSystemStatus] = useState(INITIAL_SYSTEM_STATUS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [calendarEvents, setCalendarEvents] = useState(INITIAL_CALENDAR);
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [weather, setWeather] = useState(INITIAL_WEATHER);
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [securityLogs, setSecurityLogs] = useState(INITIAL_SECURITY_LOGS);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isMobileSimOpen, setIsMobileSimOpen] = useState(false);
  const [isWinDownloadOpen, setIsWinDownloadOpen] = useState(false);

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'friday',
      text: `Good day, Boss. FRIDAY AI Neural Operating System v2.5 initialized. Vector matrix online (${INITIAL_MEMORIES.length} indexed context memories). All subsystems nominal. How may I assist your workflow today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Send message to Express Gemini Server Proxy
  const handleSendMessage = async (text: string, agent?: string): Promise<ChatMessage | null> => {
    if (!text.trim()) return null;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/friday/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: messages.slice(-6),
          agent: agent || 'assistant',
          memories: memories.slice(0, 5),
          systemInstruction: `You are FRIDAY AI, an ultra-advanced personal operating assistant. The user's name is ${userProfile.name} (call sign: "${userProfile.callSign}"). Respond concisely, intelligently, and respectfully in a Stark-style assistant tone.`,
        }),
      });

      const data = await res.json();

      const fridayMsg: ChatMessage = {
        id: `friday-${Date.now()}`,
        sender: 'friday',
        text: data.text || 'FRIDAY system received response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentUsed: data.agentUsed,
        codeSnippets: data.codeSnippets,
        actionTaken: data.actionTaken,
      };

      setMessages((prev) => [...prev, fridayMsg]);
      return fridayMsg;
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'friday',
        text: 'Apologies, boss. Experienced a temporary neural handshake fault. Auto-recovering now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return errorMsg;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white relative overflow-x-hidden">
      {/* Frosted Glass Radial Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_70%)] pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        systemStatus={systemStatus}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenMobileSim={() => setIsMobileSimOpen(true)}
        onOpenWinDownload={() => setIsWinDownloadOpen(true)}
      />

      {/* Main Tab Content View */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            userProfile={userProfile}
            systemStatus={systemStatus}
            tasks={tasks}
            setTasks={setTasks}
            calendarEvents={calendarEvents}
            reminders={reminders}
            weather={weather}
            memories={memories}
            messages={messages}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'agents' && (
          <AgentsTab agents={INITIAL_AGENTS} onSendMessage={handleSendMessage} />
        )}

        {activeTab === 'automation' && <AutomationTab workflows={workflows} />}

        {activeTab === 'vision' && <VisionTab />}

        {activeTab === 'memory' && (
          <MemoryTab memories={memories} setMemories={setMemories} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            securityLogs={securityLogs}
          />
        )}
      </main>

      {/* Siri / Iron Man Voice Overlay Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        userProfile={userProfile}
        memories={memories}
        messages={messages}
        onSendMessage={handleSendMessage}
        soundEnabled={soundEnabled}
      />

      {/* Mobile Device Simulator Modal */}
      <MobileSimulatorModal
        isOpen={isMobileSimOpen}
        onClose={() => setIsMobileSimOpen(false)}
        userProfile={userProfile}
        tasks={tasks}
        calendarEvents={calendarEvents}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Windows Desktop App Packager Modal */}
      <WinDownloadModal
        isOpen={isWinDownloadOpen}
        onClose={() => setIsWinDownloadOpen(false)}
      />
    </div>
  );
}
