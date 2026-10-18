import React, { useState } from 'react';
import {
  X,
  Play,
  ShieldAlert,
  Monitor,
  Smartphone,
  Cloud,
  Layers,
  Code,
  FileCode,
  AlertTriangle
} from 'lucide-react';
import { TaskItem, TaskCategory, TaskTarget, RiskLevel, Language } from '../types';
import { translations } from '../i18n/translations';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onCreateTask: (taskData: Partial<TaskItem>) => void;
  initialTask?: Partial<TaskItem> | null;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  language,
  onCreateTask,
  initialTask
}) => {
  const t = translations[language];

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'web_dev');
  const [target, setTarget] = useState<TaskTarget>(initialTask?.target || 'cloud');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(initialTask?.riskLevel || 'low');
  const [commandSnippet, setCommandSnippet] = useState(initialTask?.commandSnippet || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      titleBn: title.trim(),
      description: description.trim(),
      descriptionBn: description.trim(),
      category,
      target,
      riskLevel,
      commandSnippet: commandSnippet.trim() ? commandSnippet.trim() : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-[#090e1d] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden glow-cyan">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
            <h3 className="text-base font-bold font-mono text-white">
              {t.newTaskTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.taskTitlePlaceholder}
              className="w-full bg-[#050811] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Description & Objective
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.taskDescPlaceholder}
              className="w-full bg-[#050811] border border-cyan-500/30 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {/* Grid: Category & Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                {t.taskCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-[#050811] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="web_dev">Website Development</option>
                <option value="coding">Coding Assistant</option>
                <option value="windows">Windows Agent (PC Bridge)</option>
                <option value="android">Android Companion</option>
                <option value="research">Research & Search</option>
                <option value="file_management">File Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                {t.taskTarget}
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as TaskTarget)}
                className="w-full bg-[#050811] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="cloud">Cloud Hub (Browser Sandbox)</option>
                <option value="windows">Windows Companion PC</option>
                <option value="android">Android Mobile Device</option>
              </select>
            </div>
          </div>

          {/* Risk Level Assessment */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              {t.taskRisk}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setRiskLevel('low')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  riskLevel === 'low'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <div className="font-bold">{t.lowRisk}</div>
                <div className="text-[10px] text-slate-500">Auto-executes safely</div>
              </button>

              <button
                type="button"
                onClick={() => setRiskLevel('critical')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  riskLevel === 'critical'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <div className="font-bold">{t.criticalRisk}</div>
                <div className="text-[10px] text-rose-400/80">Requires Owner Approval</div>
              </button>
            </div>
          </div>

          {/* Optional Code/Command Preview */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Command or Script Payload (Optional)
            </label>
            <input
              type="text"
              value={commandSnippet}
              onChange={(e) => setCommandSnippet(e.target.value)}
              placeholder="e.g. npm run build OR git status"
              className="w-full bg-[#050811] border border-cyan-500/30 rounded-xl px-4 py-2 text-xs text-slate-200 font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Notice if Critical Risk */}
          {riskLevel === 'critical' && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                This task modifies system resources. Once submitted, it will await your confirmation in the Approval Center before executing.
              </span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold font-mono text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.createTaskBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
