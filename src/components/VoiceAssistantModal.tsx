import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Square,
  Volume2,
  RefreshCw,
  Send,
  Sparkles,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { AICoreOrb } from './AICoreOrb';
import { AIState, ChatMessage, MemoryItem, UserProfile } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  memories: MemoryItem[];
  messages: ChatMessage[];
  onSendMessage: (text: string, agent?: string) => Promise<ChatMessage | null>;
  soundEnabled: boolean;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  memories,
  messages,
  onSendMessage,
  soundEnabled,
}) => {
  const [aiState, setAiState] = useState<AIState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [continuousMode, setContinuousMode] = useState(userProfile.continuousListening);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('assistant');
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const handleVoiceQuerySubmitRef = useRef<(queryText: string) => Promise<void>>(async () => {});

  // Interrupt Speech
  const handleInterrupt = () => {
    audioEngine.playInterrupt();
    setIsSpeaking(false);
    setAiState('idle');
  };

  // Toggle listening session
  const toggleListening = () => {
    if (isSpeaking) {
      handleInterrupt();
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setAiState('idle');
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Restart error guard
        }
      } else {
        alert('Web Speech Recognition is not supported by this browser. You can type commands directly!');
      }
    }
  };

  // Process voice or text query
  const handleVoiceQuerySubmit = async (queryText: string) => {
    if (!queryText.trim()) return;

    if (soundEnabled) audioEngine.playChime();
    setAiState('thinking');
    setIsListening(false);

    // Call server API for Gemini reasoning
    const responseMsg = await onSendMessage(queryText, selectedAgent);

    if (responseMsg) {
      setAiState('speaking');
      setIsSpeaking(true);

      // Trigger TTS playback
      try {
        const ttsRes = await fetch('/api/friday/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: responseMsg.text,
            voice: userProfile.voicePreference,
          }),
        });
        const ttsData = await ttsRes.json();

        if (ttsData.audioBase64) {
          audioEngine.playPcmAudio(ttsData.audioBase64, 24000, () => {
            setIsSpeaking(false);
            setAiState('idle');
            if (continuousMode) toggleListening();
          });
        } else {
          audioEngine.speakText(responseMsg.text, userProfile.voicePreference, () => {
            setIsSpeaking(false);
            setAiState('idle');
            if (continuousMode) toggleListening();
          });
        }
      } catch (e) {
        audioEngine.speakText(responseMsg.text, userProfile.voicePreference, () => {
          setIsSpeaking(false);
          setAiState('idle');
          if (continuousMode) toggleListening();
        });
      }
    } else {
      setAiState('idle');
    }
  };

  // Keep ref updated
  useEffect(() => {
    handleVoiceQuerySubmitRef.current = handleVoiceQuerySubmit;
  });

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setAiState('listening');
          if (soundEnabled) audioEngine.playListeningPing();
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const final = event.results[i][0].transcript;
              setTranscript(final);
              handleVoiceQuerySubmitRef.current(final);
            } else {
              interim += event.results[i][0].transcript;
              setTranscript(interim);
              setAudioLevel(Math.min(1, interim.length * 0.05));
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          setAiState('idle');
        };

        recognition.onend = () => {
          setIsListening(false);
          setAudioLevel(0);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [soundEnabled]);

  // Auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, transcript]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const query = textInput;
    setTextInput('');
    handleVoiceQuerySubmit(query);
  };

  const quickPrompts = [
    'Give me my morning executive briefing',
    'Summarize my active Q3 project goals',
    'Write a Python script for file organizing',
    'Create a study guide for Quantum Neural Networks',
    'What is today\'s weather forecast?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-fade-in">
      {/* Liquid Glass Background Card */}
      <div className="relative w-full max-w-4xl h-[85vh] flex flex-col rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
            <span className="font-mono font-bold tracking-widest text-white text-sm">
              FRIDAY AI VOICE HUD
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Continuous Mode Toggle */}
            <button
              onClick={() => setContinuousMode(!continuousMode)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                continuousMode
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Continuous: {continuousMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Close */}
            <button
              onClick={() => {
                audioEngine.stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Orb & Visualizer Section */}
        <div className="flex-1 flex flex-col items-center justify-center relative p-6 bg-gradient-to-b from-white/5 via-transparent to-black/30 overflow-hidden">
          {/* Background Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* 3D Holographic AI Core Orb */}
          <AICoreOrb
            aiState={aiState}
            isListening={isListening}
            isSpeaking={isSpeaking}
            audioLevel={audioLevel}
            onClick={toggleListening}
            size="lg"
          />

          {/* Live Voice Prompt / Transcript Bar */}
          <div className="z-20 w-full max-w-xl text-center my-4 min-h-[48px] flex items-center justify-center">
            {transcript ? (
              <p className="text-sm font-mono text-sky-200 bg-sky-500/10 border border-sky-500/30 px-4 py-2 rounded-2xl backdrop-blur-md animate-fade-in">
                "{transcript}"
              </p>
            ) : isListening ? (
              <p className="text-sm font-mono text-purple-300 animate-pulse">
                Listening for speech... Say "Hey Friday" or speak your command.
              </p>
            ) : isSpeaking ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono text-emerald-300">FRIDAY is speaking...</p>
                <button
                  onClick={handleInterrupt}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono hover:bg-rose-500/30 transition-all"
                >
                  Interrupt
                </button>
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-400">
                Tap Orb or Microphone button below to speak with FRIDAY AI
              </p>
            )}
          </div>

          {/* Quick Command Chips */}
          <div className="z-20 flex flex-wrap justify-center gap-2 max-w-2xl mt-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleVoiceQuerySubmit(p)}
                className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-sky-300 transition-all backdrop-blur-md"
              >
                + {p}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Log Preview */}
        <div className="h-44 border-t border-white/10 bg-black/20 p-4 overflow-y-auto font-mono text-xs space-y-3 backdrop-blur-md">
          {messages.slice(-4).map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-2xl max-w-2xl backdrop-blur-md ${
                msg.sender === 'user'
                  ? 'ml-auto bg-sky-500/10 text-sky-200 border border-sky-500/30'
                  : 'mr-auto bg-white/5 text-slate-200 border border-white/10'
              }`}
            >
              <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                <span>{msg.sender === 'user' ? 'YOU' : 'FRIDAY AI'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input & Action Control Footer */}
        <form onSubmit={handleTextSubmit} className="p-4 border-t border-white/10 bg-white/5 flex items-center gap-3 backdrop-blur-md">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl font-bold transition-all ${
              isListening
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40 animate-pulse'
                : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type or speak a message to FRIDAY AI..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 font-mono backdrop-blur-md"
          />

          <button
            type="submit"
            disabled={!textInput.trim()}
            className="p-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white disabled:opacity-40 transition-all font-bold shadow-lg shadow-sky-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
