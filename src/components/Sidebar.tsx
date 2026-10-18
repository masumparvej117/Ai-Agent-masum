import React from 'react';
import {
  MessageSquare,
  PlusCircle,
  Globe,
  Code2,
  Search,
  FolderKanban,
  Monitor,
  Smartphone,
  ShieldAlert,
  History,
  Settings,
  Cpu,
  Terminal,
  Activity,
  LayoutDashboard
} from 'lucide-react';
import { NavigationTab, Language } from '../types';
import { translations } from '../i18n/translations';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  language: Language;
  pendingApprovalsCount: number;
  activeTasksCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenNewTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  language,
  pendingApprovalsCount,
  activeTasksCount,
  isOpenMobile,
  setIsOpenMobile,
  onOpenNewTask
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'command-center' as NavigationTab, label: 'Command Center', icon: LayoutDashboard, badge: 'Hub' },
    { id: 'chat' as NavigationTab, label: 'AI Chat', icon: MessageSquare, badge: 'Multilingual' },
    { id: 'web-dev' as NavigationTab, label: 'Website Development', icon: Globe, badge: 'React' },
    { id: 'coding' as NavigationTab, label: 'Coding Assistant', icon: Code2, badge: null },
    { id: 'research' as NavigationTab, label: 'Research & Search', icon: Search, badge: null },
    { id: 'file-manager' as NavigationTab, label: 'File Manager', icon: FolderKanban, badge: null },
    { id: 'windows-agent' as NavigationTab, label: 'Windows Agent', icon: Monitor, badge: 'PC Bridge' },
    { id: 'android-agent' as NavigationTab, label: 'Android Agent', icon: Smartphone, badge: 'Mobile' },
    {
      id: 'approval-center' as NavigationTab,
      label: 'Approval Center',
      icon: ShieldAlert,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : null,
      urgent: pendingApprovalsCount > 0
    },
    {
      id: 'task-history' as NavigationTab,
      label: 'Task History',
      icon: History,
      badge: activeTasksCount > 0 ? `${activeTasksCount} running` : null
    },
    { id: 'settings' as NavigationTab, label: 'Settings & Security', icon: Settings, badge: null }
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#060b18]/95 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Logo & Branding */}
        <div>
          <div className="p-5 border-b border-cyan-500/15 flex items-center justify-between">
            <button
              onClick={() => handleSelectTab('command-center')}
              className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 glow-cyan">
                <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#070b16]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-lg text-white tracking-wider font-mono uppercase">
                    Masum <span className="text-cyan-400 text-glow-cyan">AI</span>
                  </h1>
                </div>
                <div className="text-[11px] text-cyan-400/70 font-mono tracking-tight">
                  Owner: Masum (Developer)
                </div>
              </div>
            </button>

            <button
              onClick={() => setIsOpenMobile(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Quick Action: New Task Button */}
          <div className="p-4">
            <button
              onClick={() => {
                onOpenNewTask();
                setIsOpenMobile(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-semibold font-mono text-sm tracking-wide shadow-lg hover:shadow-cyan-500/25 hover:opacity-95 transition-all cursor-pointer active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 glow-cyan font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-cyan-400'
                          : 'text-slate-500 group-hover:text-cyan-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        item.urgent
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : isActive
                          ? 'bg-cyan-900/50 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Companion Status Bar */}
        <div className="p-4 border-t border-cyan-500/15 bg-[#050811] text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Win-Bridge</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Standby
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Android-Link</span>
            </span>
            <span className="text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Paired
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Core v1.0.5</span>
            <span className="text-cyan-400/80">Gemini-3.8-Flash</span>
          </div>
        </div>
      </aside>
    </>
  );
};
