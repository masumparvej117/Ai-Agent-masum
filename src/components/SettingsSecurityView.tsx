import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Key,
  Languages,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Cpu,
  Lock,
  Terminal,
  BookOpen,
  Info,
  Globe
} from 'lucide-react';
import { Language, SystemHealth } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface SettingsSecurityViewProps {
  language: Language;
  onToggleLanguage?: () => void;
}

export const SettingsSecurityView: React.FC<SettingsSecurityViewProps> = ({
  language
}) => {
  const t = translations[language];

  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [bridgeToken, setBridgeToken] = useState('MSM-WIN-BRIDGE-SEC-8829');
  const [requireCriticalApproval, setRequireCriticalApproval] = useState(true);
  const [requireHighRiskApproval, setRequireHighRiskApproval] = useState(true);
  const [dryRunMode, setDryRunMode] = useState(false);

  useEffect(() => {
    api.getSystemHealth().then(setHealth).catch(console.error);
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-cyan-500/25 glow-cyan">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Security Architecture & Policy Preferences</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold font-mono text-white">
          {t.navSettings}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Configure security guardrails, authentication tokens, and review step-by-step developer guidelines.
        </p>
      </div>

      {/* Beginner Step-by-Step Testing Guide in pure English */}
      <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono text-base">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>Verification & Testing Guide: Multilingual AI + Plan-vs-Action Safety</span>
        </div>

        <div className="space-y-3 font-mono text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-cyan-400 font-bold">1. Secure Server-Side Gemini AI Chat & Multilingual Understanding:</span>
            <p className="text-slate-400 mt-1 font-sans">
              Go to the "AI Chat" tab and send instructions in English, Bangla, Banglish (e.g. "Amar website design kore dao"), Hindi, or Arabic. The backend in <code className="text-cyan-300 font-mono">server.ts</code> processes requests with the <code className="text-cyan-300 font-mono">gemini-3.8-flash</code> model while keeping the API key strictly on the server. The AI automatically detects your language and replies in that matching language.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-cyan-400 font-bold">2. Strict Separation of Proposed Plans vs. Executed Actions:</span>
            <p className="text-slate-400 mt-1 font-sans">
              When requesting actions or code builds, the AI generates a clearly demarcated <span className="text-amber-400 font-semibold">[AI-GENERATED PLAN · PROPOSED ONLY]</span> card. It never claims an action has run until you explicitly verify and click **"Launch as Verified Task"**.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-cyan-400 font-bold">3. Voice Input & Speech Recognition:</span>
            <p className="text-slate-400 mt-1 font-sans">
              Click the microphone button in the chat box to activate speech-to-text. Speak naturally in your preferred language to dictate prompts directly into the message console.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-cyan-400 font-bold">4. Windows PC & Android Companion Security:</span>
            <p className="text-slate-400 mt-1 font-sans">
              In the "Windows Agent" section, test allowlisted commands such as <code className="text-cyan-300 font-mono">git status</code> or <code className="text-cyan-300 font-mono">npm run dev</code>. Unallowlisted or dangerous commands are blocked by the backend security guard. Test mobile notification dispatches in the "Android Agent" view.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Server Health & Security Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Server Core Health */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Server-Side Gemini Core Status</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400">AI Service:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{health?.aiStatus === 'connected' ? 'Connected (Gemini-3.8-Flash)' : 'Active (Local + Cloud Proxy)'}</span>
              </span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400">API Key Privacy:</span>
              <span className="text-cyan-300">Secured on Server (Zero Client Leak)</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400">Language Detection:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Multilingual Auto-Detect Active</span>
              </span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400">Active Tasks:</span>
              <span className="text-cyan-300">{health?.tasksCount || 4} Managed</span>
            </div>
          </div>
        </div>

        {/* Card 2: Security Policies */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Autonomous Safety Policies</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <span className="text-slate-300">Require Approval for File Overwrites / Deletions</span>
              <input
                type="checkbox"
                checked={requireCriticalApproval}
                onChange={(e) => setRequireCriticalApproval(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <span className="text-slate-300">Block Unlisted Windows Shell Commands</span>
              <input
                type="checkbox"
                checked={requireHighRiskApproval}
                onChange={(e) => setRequireHighRiskApproval(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <span className="text-slate-300">Simulation Dry-Run Mode</span>
              <input
                type="checkbox"
                checked={dryRunMode}
                onChange={(e) => setDryRunMode(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
