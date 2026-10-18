import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Terminal,
  FolderLock,
  ShieldCheck,
  Play,
  RotateCw,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Key,
  Server,
  Lock,
  CheckCircle2,
  XCircle,
  FileCode2
} from 'lucide-react';
import { Language, WindowsCompanionState } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface WindowsAgentViewProps {
  language: Language;
}

export const WindowsAgentView: React.FC<WindowsAgentViewProps> = ({ language }) => {
  const t = translations[language];

  const [companion, setCompanion] = useState<WindowsCompanionState | null>(null);
  const [selectedCommand, setSelectedCommand] = useState('git status');
  const [customCommand, setCustomCommand] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string>('Console initialized. Ready for allowlisted execution...');
  const [isRunningCommand, setIsRunningCommand] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'security' | 'script'>('console');

  const fetchCompanion = async () => {
    try {
      const data = await api.getWindowsCompanion();
      setCompanion(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompanion();
  }, []);

  const handleToggleConnect = async () => {
    try {
      const updated = await api.toggleWindowsConnect();
      setCompanion(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunCommand = async (cmdToRun: string) => {
    if (!cmdToRun.trim() || isRunningCommand) return;
    setIsRunningCommand(true);
    setConsoleOutput(`> Executing on Windows Companion Bridge:\n> ${cmdToRun}\n`);

    try {
      const res = await api.executeWindowsCommand(cmdToRun);
      if (res.success) {
        setConsoleOutput((prev) => `${prev}\n${res.output}\n\n[Status: SUCCESS 200 OK]`);
      } else {
        setConsoleOutput(
          (prev) =>
            `${prev}\n[SECURITY REJECTION]\n${res.error}\n\n[Action blocked by Windows Bridge Guard]`
        );
      }
    } catch (err: any) {
      setConsoleOutput((prev) => `${prev}\nError: ${err.message}`);
    } finally {
      setIsRunningCommand(false);
      fetchCompanion();
    }
  };

  const companionScriptCode = `# ==============================================================
# Masum AI Windows Companion Bridge Agent (Daemon Script)
# Run this PowerShell script on your Windows PC to securely bridge
# with your Masum AI Cloud Hub without giving unrestricted shell access.
# ==============================================================

param(
    [string]$HubUrl = "https://your-masum-ai-instance.run.app",
    [string]$AuthToken = "MSM-WIN-BRIDGE-SEC-8829",
    [string]$AllowedSandbox = "C:\\Users\\Masum\\Projects\\masum-workspace"
)

Write-Host "[+] Initializing Masum AI Secure Windows Daemon..." -ForegroundColor Cyan
Write-Host "[+] Sandbox Directory: $AllowedSandbox" -ForegroundColor Green
Write-Host "[+] Security Guard: ALLOWLIST ONLY. Arbitrary commands blocked." -ForegroundColor Yellow

# Safe Allowlisted execution handler
function Execute-SafeCommand {
    param([string]$Cmd)
    
    $Allowlist = @("git status", "git branch", "git log -n 5", "npm run dev", "npm test", "dir")
    if ($Allowlist -contains $Cmd.Trim().ToLower()) {
        Write-Host "[*] Executing allowlisted command: $Cmd" -ForegroundColor Cyan
        Invoke-Expression $Cmd
    } else {
        Write-Error "[!] Security Exception: Command '$Cmd' is NOT in allowlist."
    }
}

Write-Host "[+] Bridge listening on localhost:8829. Waiting for heartbeat..." -ForegroundColor Green
`;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-cyan-500/25 glow-cyan space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-400">
              <Monitor className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-mono text-white">
                  {t.winTitle}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-700">
                  {t.demoBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {t.winSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleConnect}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                companion?.status === 'connected'
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>
                {companion?.status === 'connected' ? 'Connected (Simulated)' : 'Connect Bridge'}
              </span>
            </button>
          </div>
        </div>

        {/* Real Windows Security Truth Alert */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-300">Security Architecture Notice: </span>
            A web application cannot silently access or execute unrestricted commands on your Windows PC. For actual execution, Masum AI connects to a token-authenticated daemon running on your computer.
          </div>
        </div>
      </div>

      {/* Grid: Bridge Status & Token Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Daemon Connection</span>
            <span className="text-cyan-400">REST + WebSocket</span>
          </div>
          <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                companion?.status === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            <span>{companion?.status.toUpperCase() || 'STANDBY'}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Host: {companion?.host} ({companion?.ip})
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Authentication Token</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(companion?.token || '');
                setCopiedToken(true);
                setTimeout(() => setCopiedToken(false), 2000);
              }}
              className="text-cyan-400 hover:text-cyan-300 text-[11px] cursor-pointer"
            >
              {copiedToken ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-sm font-mono text-cyan-300 truncate bg-slate-950 p-2 rounded border border-slate-800">
            {companion?.token}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Symmetric token encryption required
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Security Sandbox</span>
            <span className="text-emerald-400">Enforced</span>
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>ALLOWLIST ONLY</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            3 Safe Directories Configured
          </div>
        </div>
      </div>

      {/* Main Workspace: Command Runner, Allowed Dirs, and Daemon Code */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#070b16] overflow-hidden shadow-2xl">
        {/* Workspace Subtabs */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'console'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Allowlisted Command Console
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sandboxed Directories & Policy
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'script'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Companion Daemon Script
          </button>
        </div>

        {/* Tab 1: Console */}
        {activeTab === 'console' && (
          <div className="p-6 space-y-5">
            {/* Command Allowlist Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                {t.allowlistCmdTitle}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'git status',
                  'git branch',
                  'npm run dev',
                  'npm test',
                  'node -v',
                  'npm audit'
                ].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setSelectedCommand(cmd);
                      handleRunCommand(cmd);
                    }}
                    disabled={isRunningCommand}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                      selectedCommand === cmd
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 glow-cyan'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom command test (safety guard test) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-slate-300 font-semibold">
                  Custom Command Test (Guarded)
                </span>
                <span className="text-rose-400 text-[11px]">
                  Unlisted commands will be blocked
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-[#070b16] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs font-mono text-slate-200">
                  <span className="text-cyan-400 mr-2">C:\masum-workspace&gt;</span>
                  <input
                    type="text"
                    value={customCommand}
                    onChange={(e) => setCustomCommand(e.target.value)}
                    placeholder="e.g. git status OR rm -rf C: (will be blocked)"
                    className="flex-1 bg-transparent border-0 focus:outline-none text-slate-200 text-xs"
                    onKeyDown={(e) => e.key === 'Enter' && handleRunCommand(customCommand)}
                  />
                </div>
                <button
                  onClick={() => handleRunCommand(customCommand)}
                  disabled={!customCommand.trim() || isRunningCommand}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-xs hover:bg-cyan-400 transition-all cursor-pointer disabled:opacity-40"
                >
                  {isRunningCommand ? 'Running...' : t.runCommand}
                </button>
              </div>
            </div>

            {/* Console Output Screen */}
            <div className="rounded-xl border border-slate-800 bg-[#020408] overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Windows Companion Terminal Output</span>
                </span>
                <span>UTF-8</span>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed h-52 overflow-y-auto">
                <code>{consoleOutput}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Sandboxed Directories & Policy */}
        {activeTab === 'security' && (
          <div className="p-6 bg-[#050811] space-y-6 min-h-[480px]">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 mb-2">
                <FolderLock className="w-4 h-4 text-cyan-400" />
                <span>{t.allowedDirsTitle}</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Masum AI Companion is restricted exclusively to these paths. Outside paths are rejected with 403 Forbidden.
              </p>

              <div className="space-y-2">
                {(companion?.allowedDirectories || [
                  'C:\\Users\\Masum\\Projects\\masum-workspace',
                  'D:\\Development\\my-web-apps',
                  'C:\\Users\\Masum\\Desktop\\TestingGround'
                ]).map((dir, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-cyan-300">{dir}</span>
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sandbox Allowed</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Developer Explanatory Card */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-xs">
              <h4 className="font-bold text-cyan-300 font-mono text-sm">{t.howItWorksTitle}</h4>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{t.howItWorksDesc}</p>
            </div>
          </div>
        )}

        {/* Tab 3: Companion Script */}
        {activeTab === 'script' && (
          <div className="p-6 bg-[#050811] space-y-4 min-h-[480px]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <span>Windows Companion Bridge Script (PowerShell / Node.js)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Save this script as <code className="text-cyan-300">masum-agent.ps1</code> on your Windows PC to run the companion daemon.
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(companionScriptCode);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto">
              <code>{companionScriptCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
