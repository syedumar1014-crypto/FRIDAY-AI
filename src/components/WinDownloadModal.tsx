import React, { useState } from 'react';
import {
  X,
  Download,
  Terminal,
  Check,
  Copy,
  Laptop,
  Folder,
  Play,
  Cpu,
  Layers,
  Sparkles,
  ShieldAlert,
  Command,
  Monitor,
} from 'lucide-react';

interface WinDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WinDownloadModal: React.FC<WinDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'quick' | 'electron' | 'python'>('quick');

  if (!isOpen) return null;

  const quickBatchScript = `@echo off
title FRIDAY AI Desktop Assistant Launcher
echo ========================================================
echo         FRIDAY AI DESKTOP ASSISTANT - SETUP
echo ========================================================
echo [1/3] Checking Node.js and Python environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Download from https://nodejs.org
    pause
    exit /b
)

echo [2/3] Installing dependencies...
call npm install

echo [3/3] Launching FRIDAY AI Desktop HUD...
echo Starting local web server & background automation services...
start http://localhost:3000
call npm run dev

pause`;

  const electronPackageJson = `{
  "name": "friday-ai-desktop",
  "version": "1.0.0",
  "description": "FRIDAY AI Desktop Assistant for Windows",
  "main": "electron/main.cjs",
  "scripts": {
    "dev": "tsx server.ts",
    "electron:dev": "concurrently \\"npm run dev\\" \\"wait-on http://localhost:3000 && electron .\\"",
    "dist:win": "electron-builder --win nsis"
  },
  "build": {
    "appId": "com.friday.assistant",
    "productName": "FRIDAY AI",
    "win": {
      "target": ["nsis", "portable"],
      "icon": "public/icon.ico"
    }
  }
}`;

  const electronMainScript = `// electron/main.cjs - Electron Main Process for FRIDAY AI
const { app, BrowserWindow, globalShortcut, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    frame: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#030712',
    icon: path.join(__dirname, '../public/icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load local server or production index
  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  // Global Hotkey for "Hey Friday" overlay (Alt + Space)
  globalShortcut.register('Alt+Space', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(label);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-3xl h-[85vh] flex flex-col rounded-3xl bg-slate-950/90 border border-sky-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold shadow-lg shadow-sky-500/20">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-wider text-sky-300 text-sm">
                  FRIDAY DESKTOP PACKAGER (.EXE)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold">
                  Windows 10/11 Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Download source code & build your native desktop executable
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-black/20 font-mono text-xs">
          <button
            onClick={() => setSelectedTab('quick')}
            className={`px-4 py-2 rounded-t-xl border-t border-x transition-all flex items-center gap-2 ${
              selectedTab === 'quick'
                ? 'bg-white/10 border-sky-500/40 text-sky-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-sky-400" />
            <span>1-Click Win Run Script</span>
          </button>
          <button
            onClick={() => setSelectedTab('electron')}
            className={`px-4 py-2 rounded-t-xl border-t border-x transition-all flex items-center gap-2 ${
              selectedTab === 'electron'
                ? 'bg-white/10 border-indigo-500/40 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-indigo-400" />
            <span>Electron .exe Build Setup</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 font-mono">
          {/* Step 0: How to Export ZIP */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border border-sky-500/30 space-y-3">
            <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider">
              <Folder className="w-4 h-4 text-sky-400" />
              <span>Step 1: Export Source Code from AI Studio</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Click the <strong className="text-white">Settings / Export</strong> menu at the top right of AI Studio interface, and select <strong className="text-sky-300">"Export ZIP"</strong> or <strong className="text-sky-300">"Export to GitHub"</strong>. Extract the ZIP file into a folder on your Windows PC.
            </p>
          </div>

          {selectedTab === 'quick' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>run_friday_windows.bat Script</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Save this content inside your project folder as <code className="text-sky-300">run_friday.bat</code> and double-click to launch on Windows!
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(quickBatchScript, 'batch')}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copiedScript === 'batch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript === 'batch' ? 'Copied!' : 'Copy Batch Script'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-emerald-300 overflow-x-auto font-mono select-all shadow-inner leading-relaxed">
                {quickBatchScript}
              </pre>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-300">
                <div className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Windows Startup & Global Hotkey Setup:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Win + R</kbd>, type <code className="text-sky-300">shell:startup</code>, and press Enter.</li>
                  <li>Paste a shortcut of <code className="text-sky-300">run_friday.bat</code> there to auto-start FRIDAY on Windows boot!</li>
                  <li>Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Alt + Space</kbd> to toggle the FRIDAY HUD instantly.</li>
                </ul>
              </div>
            </div>
          )}

          {selectedTab === 'electron' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-400" />
                    <span>1. electron/main.cjs Entry Point</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(electronMainScript, 'electron')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedScript === 'electron' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript === 'electron' ? 'Copied!' : 'Copy main.cjs'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-indigo-200 overflow-x-auto font-mono select-all leading-relaxed">
                  {electronMainScript}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>2. Run electron-builder command to generate .exe</span>
                </h4>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-sky-300 font-mono">
                  npm install --save-dev electron electron-builder wait-on concurrently
                  <br />
                  npx electron-builder --win nsis
                </div>
                <p className="text-[11px] text-slate-400">
                  This compiles a standalone <strong className="text-white">FRIDAY-AI-Setup-1.0.0.exe</strong> installer in your <code className="text-sky-300">/dist</code> directory!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Windows 10 / 11 64-bit Compatible</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
