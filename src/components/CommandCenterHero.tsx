import React from 'react';
import {
  MessageSquare,
  Globe,
  Monitor,
  Smartphone,
  Search,
  FolderKanban,
  ShieldAlert,
  Cpu,
  Sparkles,
  ArrowRight,
  Terminal,
  Zap,
  CheckCircle2,
  Lock,
  Radio,
  Layers,
  Activity
} from 'lucide-react';
import { NavigationTab, Language, SystemHealth } from '../types';

interface CommandCenterHeroProps {
  language: Language;
  onNavigate: (tab: NavigationTab) => void;
  onOpenNewTask: () => void;
  pendingApprovals: number;
  activeTasks: number;
  health: SystemHealth | null;
}

export const CommandCenterHero: React.FC<CommandCenterHeroProps> = ({
  onNavigate,
  onOpenNewTask,
  pendingApprovals,
  activeTasks,
  health
}) => {
  const featurePanels = [
    {
      id: 'chat' as NavigationTab,
      title: 'AI Chat & Neural Planner',
      subtitle: 'Multilingual conversational intelligence with Gemini 3.8-Flash and distinct plan-vs-action safety',
      icon: MessageSquare,
      badge: 'Multilingual',
      accent: 'cyan',
      stats: 'Auto-Detect All Languages'
    },
    {
      id: 'web-dev' as NavigationTab,
      title: 'Website Development',
      subtitle: 'Full-stack React, HTML5 & Next.js code generation with responsive live sandbox and SEO audit',
      icon: Globe,
      badge: 'React & Tailwind',
      accent: 'emerald',
      stats: 'Interactive Sandbox'
    },
    {
      id: 'windows-agent' as NavigationTab,
      title: 'Windows Companion Agent',
      subtitle: 'Sandboxed local PC bridge with allowlisted dev commands, project folder access & token security',
      icon: Monitor,
      badge: 'PC Bridge',
      accent: 'cyan',
      stats: health?.windowsCompanionStatus ? `Status: ${health.windowsCompanionStatus.toUpperCase()}` : 'Standby'
    },
    {
      id: 'android-agent' as NavigationTab,
      title: 'Android Companion Agent',
      subtitle: 'Mobile push notification alerts, remote approval checks & scoped permission sandbox',
      icon: Smartphone,
      badge: 'Mobile Link',
      accent: 'emerald',
      stats: 'Galaxy S24 Paired'
    },
    {
      id: 'research' as NavigationTab,
      title: 'Deep Research & Web Search',
      subtitle: 'Automated documentation synthesis, library comparison checklists and architectural summaries',
      icon: Search,
      badge: 'Knowledge',
      accent: 'cyan',
      stats: 'Multi-Source Synthesis'
    },
    {
      id: 'file-manager' as NavigationTab,
      title: 'Sandboxed File Manager',
      subtitle: 'Project workspace filesystem explorer with protected environment variables and diff inspection',
      icon: FolderKanban,
      badge: 'Protected FS',
      accent: 'emerald',
      stats: 'Write-Guarded'
    },
    {
      id: 'approval-center' as NavigationTab,
      title: 'Security Approval Center',
      subtitle: 'Mandatory human-in-the-loop authorization for sensitive commands, deletions, and config overwrites',
      icon: ShieldAlert,
      badge: pendingApprovals > 0 ? `${pendingApprovals} Awaiting` : 'Protected',
      accent: pendingApprovals > 0 ? 'rose' : 'cyan',
      stats: pendingApprovals > 0 ? 'Action Required' : 'All Clear'
    }
  ];

  return (
    <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* 1. Large Glowing Centerpiece Logo & Hero Header */}
      <section className="text-center relative pt-6 pb-4">
        {/* Luminous circular ambient platform beneath the logo */}
        <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-cyan-500/20 via-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative inline-flex flex-col items-center">
          {/* Animated Central Cyber Core Logo */}
          <div className="relative mb-6">
            {/* Outer Rotating Hexagonal Rings */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-[#091124]/90 border-2 border-cyan-400/60 p-2 relative flex items-center justify-center glow-cyan-lg shadow-2xl backdrop-blur-xl">
              {/* Inner Pulsing Rings */}
              <div className="absolute inset-2 rounded-2xl border border-emerald-400/40 animate-pulse" />
              <div className="absolute -inset-1.5 rounded-3xl border border-cyan-500/30 animate-spin [animation-duration:12s]" />

              {/* Central Core Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-cyan-950 via-[#050f24] to-emerald-950 border border-cyan-400/80 flex items-center justify-center shadow-inner">
                <Cpu className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 animate-pulse" />
              </div>

              {/* Corner Tech Accents */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#040712] animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#040712]" />
            </div>

            {/* Holographic Platform Baseline */}
            <div className="w-48 h-3 mx-auto mt-2 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent blur-[1px]" />
          </div>

          {/* Title and Tagline */}
          <div className="space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MASUM AI :: AUTONOMOUS COMMAND CENTER v2.5</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-mono tracking-wider text-white uppercase drop-shadow-md">
              MASUM <span className="text-cyan-400 text-glow-cyan">AI</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed drop-shadow">
              Personal Autonomous AI Agent & Cyber Command Center · Synchronized with Windows PC & Android Companions
            </p>
          </div>

          {/* Core System Status Ticker */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-[#091124]/80 border border-cyan-500/30 text-cyan-300 flex items-center gap-2 backdrop-blur-md shadow">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Core: Gemini-3.8-Flash</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#091124]/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 backdrop-blur-md shadow">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multilingual Engine: Auto-Detect Active</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#091124]/80 border border-slate-700 text-slate-300 flex items-center gap-2 backdrop-blur-md shadow">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero-Leak Server Guard: Enforced</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Command / Action Bar */}
      <section className="p-4 rounded-2xl bg-[#081024]/80 border border-cyan-500/30 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>Quick Command & Mission Launcher</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-300 font-mono">Ready</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Launch an AI conversation in any language or configure a verified background task
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('chat')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/70 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Chat</span>
          </button>

          <button
            onClick={onOpenNewTask}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg glow-cyan cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>New Task</span>
          </button>
        </div>
      </section>

      {/* 3. Elegant Floating Feature Panels (Glassmorphism & Neon Lighting) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Command Center Active Modules</span>
          </div>
          <span className="text-xs font-mono text-slate-500">7 Connected Subsystems</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featurePanels.map((panel) => {
            const Icon = panel.icon;
            const isRose = panel.accent === 'rose';
            const isEmerald = panel.accent === 'emerald';

            return (
              <div
                key={panel.id}
                onClick={() => onNavigate(panel.id)}
                className={`group p-6 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden backdrop-blur-xl border ${
                  isRose
                    ? 'bg-[#180b14]/80 border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/20 shadow-xl'
                    : isEmerald
                    ? 'bg-[#06161a]/80 border-emerald-500/35 hover:border-emerald-400 hover:shadow-emerald-500/20 shadow-xl'
                    : 'bg-[#081226]/80 border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/20 shadow-xl'
                } hover:-translate-y-1`}
              >
                {/* Subtle Ambient Glow Behind Card */}
                <div
                  className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl transition-opacity opacity-20 group-hover:opacity-40 ${
                    isRose ? 'bg-rose-500' : isEmerald ? 'bg-emerald-500' : 'bg-cyan-500'
                  }`}
                />

                {/* Card Top: Icon & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl border ${
                      isRose
                        ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                        : isEmerald
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                        : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${
                      isRose
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/50 animate-pulse'
                        : isEmerald
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                        : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                    }`}
                  >
                    {panel.badge}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-base font-bold text-white font-mono mb-2 group-hover:text-cyan-300 transition-colors">
                  {panel.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-5 line-clamp-2">
                  {panel.subtitle}
                </p>

                {/* Card Footer: Live Status & Jump Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">{panel.stats}</span>
                  <div className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Bottom System Telemetry Strip */}
      <footer className="p-4 rounded-xl bg-[#060c1d]/90 border border-slate-800 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Masum AI Autonomous Architecture · English Command Center · Multilingual AI</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>WebGL 3D: Enabled</span>
          <span>·</span>
          <span>Full-Stack Node.js: Operational</span>
          <span>·</span>
          <span>Owner: Masum</span>
        </div>
      </footer>
    </div>
  );
};
