export type AIState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'executing';

export type AgentType = 'research' | 'coding' | 'study' | 'productivity' | 'assistant';

export interface AgentInfo {
  id: AgentType;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  accentBg: string;
  capabilities: string[];
  systemPrompt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'friday';
  text: string;
  timestamp: string;
  agentUsed?: AgentType;
  codeSnippets?: { language: string; code: string }[];
  sources?: string[];
  imageUri?: string;
  memoryRetrieved?: string[];
  actionTaken?: string;
  audioUrl?: string;
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'fact' | 'goal' | 'habit' | 'project' | 'event';
  key: string;
  value: string;
  timestamp: string;
  importance: 'high' | 'medium' | 'low';
  vectorEmbedded: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'work' | 'personal' | 'study' | 'health';
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  location?: string;
  type: 'meeting' | 'reminder' | 'focus' | 'personal';
  color: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  date: string;
  active: boolean;
  repeat: 'none' | 'daily' | 'weekly';
  triggered?: boolean;
}

export interface UserProfile {
  name: string;
  callSign: string;
  timezone: string;
  country: string;
  language: string;
  dateFormat: string;
  voicePreference: 'kore' | 'zephyr' | 'puck' | 'fenrir' | 'charon';
  wakeWordEnabled: boolean;
  continuousListening: boolean;
  soundEffects: boolean;
  workStartTime: string;
  workEndTime: string;
  dailyGoal: string;
  apiHealth: 'optimal' | 'degraded' | 'offline';
}

export interface SystemStatus {
  cpuLoad: number;
  memoryUsage: number;
  diskUsage?: number;
  neuralLatencyMs: number;
  activeThreads: number;
  securityShield: boolean;
  uptimeSeconds: number;
  vectorIndexCount: number;
}

export interface WeatherData {
  city: string;
  tempC: number;
  tempF: number;
  condition: string;
  humidity: number;
  windSpeed: string;
  icon: string;
  forecast: { day: string; temp: number; cond: string }[];
}

export interface AutomatedWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: string[];
  icon: string;
  lastRun?: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'passed' | 'warning' | 'alert';
  details: string;
}
