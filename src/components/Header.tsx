import React from 'react';
import {
  Menu,
  Globe,
  Shield,
  Activity,
  AlertTriangle,
  Monitor,
  Smartphone,
  Cpu,
  PowerOff
} from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onToggleLanguage?: () => void;
  pendingApprovals: number;
  activeTasks: number;
  onOpenApprovalCenter: () => void;
  onToggleMobileMenu: () => void;
  onEmergencyStop: () => void;
  onNavigateToCommandCenter?: () => void;
  windowsStatus: string;
  androidStatus: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  pendingApprovals,
  activeTasks,
  onOpenApprovalCenter,
  onToggleMobileMenu,
  onEmergencyStop,
  onNavigateToCommandCenter,
  windowsStatus,
  androidStatus
}) => {
  const t = translations[language];

  return (
    <header className="h-16 px-4 md:px-6 bg-[#070b16]/90 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onNavigateToCommandCenter}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400/60 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>MASUM-CORE::ONLINE</span>
          </button>

          {/* Device Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300">
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span>PC: {windowsStatus.toUpperCase()}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone: {androidStatus.toUpperCase()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Pending Approvals, Emergency Stop, Multilingual AI Engine Badge */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Pending Approval Alert Button */}
        {pendingApprovals > 0 ? (
          <button
            onClick={onOpenApprovalCenter}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 font-mono text-xs hover:bg-rose-500/30 transition-all animate-bounce cursor-pointer"
            title="Approvals required"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-bold">{pendingApprovals}</span>
            <span className="hidden sm:inline">Pending Approvals</span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-400 border border-slate-800 rounded bg-slate-900/50">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>0 Pending Approvals</span>
          </div>
        )}

        {/* Active Tasks Badge */}
        {activeTasks > 0 && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-cyan-300 border border-cyan-800/60 rounded bg-cyan-950/30">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>{activeTasks} Running</span>
          </div>
        )}

        {/* Emergency Stop Button */}
        <button
          onClick={onEmergencyStop}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-700/60 text-red-400 hover:bg-red-900/80 hover:text-white transition-all text-xs font-mono cursor-pointer"
          title="Emergency Stop All Tasks"
        >
          <PowerOff className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Emergency Stop</span>
        </button>

        {/* Multilingual AI Engine Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium shadow-sm"
          title="AI automatically detects and responds in English, Bangla, Banglish, Hindi, Arabic, etc."
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Multilingual AI</span>
          <span className="sm:hidden">AI</span>
        </div>
      </div>
    </header>
  );
};
