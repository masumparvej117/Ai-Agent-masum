import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Monitor,
  Smartphone,
  Cloud,
  FileCode,
  Terminal,
  Lock,
  Info
} from 'lucide-react';
import { TaskItem, Language } from '../types';
import { translations } from '../i18n/translations';

interface ApprovalCenterViewProps {
  tasks: TaskItem[];
  language: Language;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
}

export const ApprovalCenterView: React.FC<ApprovalCenterViewProps> = ({
  tasks,
  language,
  onApprove,
  onReject
}) => {
  const t = translations[language];
  const [rejectReason, setRejectReason] = useState<{ [key: string]: string }>({});
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);

  // Filter tasks requiring approval
  const pendingApprovals = tasks.filter((t) => t.status === 'needs_approval');

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'windows':
        return <Monitor className="w-4 h-4 text-cyan-400" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      default:
        return <Cloud className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50 glow-rose';
      case 'high':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'medium':
        return 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-cyan-500/30 glow-cyan">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono text-white tracking-wide">
                {t.approvalTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {t.approvalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 shrink-0">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Backend Guard: ENFORCED</span>
          </div>
        </div>

        {/* Informative Security Guideline Box for Developers */}
        <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-cyan-300">
              Why is this approval mandatory?
            </span>
            <p className="text-slate-400 mt-0.5 leading-relaxed">
              To prevent autonomous agents from accidentally deleting project files, overwriting production configurations, or executing irreversible commands, Masum AI halts execution on the server until you explicitly review and grant consent.
            </p>
          </div>
        </div>
      </div>

      {/* List of Pending Approvals */}
      {pendingApprovals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#090e1d]/50 border border-slate-800 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-semibold text-white font-mono">
            {t.noPendingApprovals}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All sensitive actions have either been reviewed or none are currently queued. System state is secure.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((task) => (
            <div
              key={task.id}
              className="p-5 md:p-6 rounded-2xl bg-[#090e1d] border border-rose-500/30 shadow-xl space-y-4"
            >
              {/* Task Header info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {getTargetIcon(task.target)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400">[{task.id}]</span>
                      <h3 className="text-base font-bold text-white">
                        {task.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
                      <span>Target: {task.target.toUpperCase()}</span>
                      <span>·</span>
                      <span>Category: {task.category}</span>
                      <span>·</span>
                      <span>{new Date(task.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded border uppercase ${getRiskBadge(
                      task.riskLevel
                    )}`}
                  >
                    Risk: {task.riskLevel}
                  </span>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    AWAITING OWNER
                  </span>
                </div>
              </div>

              {/* Task Description */}
              <p className="text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {task.description}
              </p>

              {/* Code or Command Snippet Preview */}
              {(task.commandSnippet || task.codeSnippet) && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#050811]">
                  <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Proposed Command / Payload Execution</span>
                    </span>
                    <span className="text-rose-400 font-semibold">Sensitive Action</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{task.commandSnippet || task.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Execution Steps */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-400">Execution Plan Checklist:</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {task.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono flex items-center gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300 truncate">
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reject Reason input if triggered */}
              {showRejectInput === task.id && (
                <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
                  <label className="text-xs text-rose-300 font-mono">
                    Rejection Reason (Optional):
                  </label>
                  <input
                    type="text"
                    value={rejectReason[task.id] || ''}
                    onChange={(e) =>
                      setRejectReason({ ...rejectReason, [task.id]: e.target.value })
                    }
                    placeholder="e.g. Danger to production files, wrong directory..."
                    className="w-full bg-[#050811] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-400"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800">
                {showRejectInput !== task.id ? (
                  <button
                    onClick={() => setShowRejectInput(task.id)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-300 hover:bg-rose-950/60 font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>{t.rejectBtn}</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRejectInput(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => {
                        onReject(task.id, rejectReason[task.id]);
                        setShowRejectInput(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Confirm Rejection</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => onApprove(task.id)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-mono text-xs font-bold shadow-lg hover:shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.approveBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
