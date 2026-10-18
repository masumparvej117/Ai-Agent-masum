import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Play,
  RotateCw,
  Terminal,
  Filter,
  Monitor,
  Smartphone,
  Cloud,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { TaskItem, TaskStatus, Language } from '../types';
import { translations } from '../i18n/translations';

interface TaskHistoryViewProps {
  tasks: TaskItem[];
  language: Language;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onOpenApproval: () => void;
}

export const TaskHistoryView: React.FC<TaskHistoryViewProps> = ({
  tasks,
  language,
  onRetry,
  onCancel,
  onOpenApproval
}) => {
  const t = translations[language];

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(tasks[0] || null);

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Completed',
          class: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
        };
      case 'running':
        return {
          icon: <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />,
          label: 'Running',
          class: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
        };
      case 'needs_approval':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />,
          label: 'Needs Approval',
          class: 'bg-rose-950/60 text-rose-300 border-rose-500/40'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-slate-400" />,
          label: 'Cancelled',
          class: 'bg-slate-900 text-slate-400 border-slate-700'
        };
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Pending',
          class: 'bg-amber-950/60 text-amber-300 border-amber-500/40'
        };
    }
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'windows':
        return <Monitor className="w-3.5 h-3.5 text-cyan-400" />;
      case 'android':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Cloud className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-cyan-500/25 glow-cyan flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>{t.historyTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.historySubtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'running', label: 'Running' },
            { id: 'needs_approval', label: 'Approvals' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Task List and Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Task List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400 font-mono">
              No tasks found for current filter.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const badge = getStatusBadge(task.status);
              const isSelected = selectedTask?.id === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0b1426] border-cyan-400/80 shadow-lg glow-cyan'
                      : 'bg-[#090e1d] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400">[{task.id}]</span>
                      <h4 className="text-sm font-semibold text-white truncate max-w-[200px]">
                        {task.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${badge.class}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      {getTargetIcon(task.target)}
                      <span className="uppercase">{task.target}</span>
                    </span>
                    <span>{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Task Detail Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTask ? (
            <div className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400">Task Details: {selectedTask.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Category: {selectedTask.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedTask.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTask.status === 'needs_approval' && (
                    <button
                      onClick={onOpenApproval}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold hover:bg-rose-500 cursor-pointer animate-pulse"
                    >
                      Open in Approval Center
                    </button>
                  )}

                  {selectedTask.status === 'running' && (
                    <button
                      onClick={() => onCancel(selectedTask.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950 border border-red-700 text-red-400 font-mono text-xs hover:bg-red-900 cursor-pointer"
                    >
                      Cancel Execution
                    </button>
                  )}

                  {(selectedTask.status === 'failed' || selectedTask.status === 'cancelled') && (
                    <button
                      onClick={() => onRetry(selectedTask.id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs hover:bg-cyan-900 cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Retry Task</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Objective & Description:
                </label>
                <p className="text-sm text-slate-200 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              {/* Execution Steps */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-2">
                  {t.taskSteps} ({selectedTask.steps.length})
                </label>
                <div className="space-y-2">
                  {selectedTask.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="text-slate-200">{step.title}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded capitalize ${
                          step.status === 'completed'
                            ? 'text-emerald-400 bg-emerald-950/60'
                            : step.status === 'running'
                            ? 'text-cyan-400 bg-cyan-950/60'
                            : 'text-slate-500 bg-slate-900'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Audit Logs */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-2">
                  {t.taskLogs} ({selectedTask.logs.length})
                </label>
                <div className="rounded-xl border border-slate-800 bg-[#040711] p-3 font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedTask.logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="text-slate-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span
                        className={`shrink-0 font-bold uppercase text-[10px] ${
                          log.level === 'warn'
                            ? 'text-amber-400'
                            : log.level === 'error'
                            ? 'text-rose-400'
                            : log.level === 'success'
                            ? 'text-emerald-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        [{log.level}]
                      </span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400 font-mono">
              Select a task from the left list to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
