import React, { useState } from 'react';
import {
  FolderKanban,
  FileCode,
  FileText,
  FileCheck,
  Lock,
  Eye,
  Download,
  AlertTriangle,
  Folder,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FileManagerViewProps {
  language: Language;
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({ language }) => {
  const t = translations[language];

  const [files, setFiles] = useState([
    {
      name: 'App.tsx',
      path: '/src/App.tsx',
      size: '3.4 KB',
      modified: 'Just now',
      protected: false,
      content: `// Main Masum AI Engine Entrypoint\nimport React from 'react';\n\nexport default function App() {\n  return (\n    <main className="min-h-screen bg-slate-950 text-white">\n      <h1>Masum AI Active</h1>\n    </main>\n  );\n}`
    },
    {
      name: '.env.local',
      path: '/.env.local',
      size: '420 B',
      modified: '2 hours ago',
      protected: true, // SENSITIVE
      content: `# SENSITIVE ENVIRONMENT VARIABLES\nGEMINI_API_KEY="[SECURELY_PROTECTED_ON_SERVER]"\nAPP_SECRET="MSM_SECRET_TOKEN_9921"`
    },
    {
      name: 'tailwind.config.js',
      path: '/tailwind.config.js',
      size: '1.1 KB',
      modified: '1 day ago',
      protected: false,
      content: `export default {\n  theme: {\n    extend: {\n      colors: {\n        cyan: '#00f5ff',\n        neonGreen: '#00ff9d'\n      }\n    }\n  }\n}`
    },
    {
      name: 'windows-agent.ps1',
      path: '/scripts/windows-agent.ps1',
      size: '2.8 KB',
      modified: '3 hours ago',
      protected: false,
      content: `# Windows Companion Bridge Agent script\nparam($Token = "MSM-WIN-BRIDGE-SEC-8829")\nWrite-Host "Masum AI Windows Bridge Active"`
    }
  ]);

  const [selectedFile, setSelectedFile] = useState(files[0]);
  const [copied, setCopied] = useState(false);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#090e1d]/90 border border-cyan-500/25 glow-cyan flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4 text-cyan-400" />
            <span>Sandboxed Workspace Filesystem</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white">
            {t.navFileManager}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Safely inspect project files, environment parameters, and protected system boundaries with atomic write protection.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Write Protection: ACTIVE</span>
        </div>
      </div>

      {/* Main Split: File Tree & File Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-cyan-400" />
              <span>/masum-workspace</span>
            </span>
            <span className="text-slate-500">{files.length} files</span>
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                  selectedFile.path === file.path
                    ? 'bg-cyan-950/70 border-cyan-400/80 text-cyan-300 shadow'
                    : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {file.protected ? (
                    <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                  <span className="truncate">{file.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {file.protected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40">
                      SECURED
                    </span>
                  )}
                  <span className="text-slate-500 text-[11px]">{file.size}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: File Viewer (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-white">
                  {selectedFile.path}
                </span>
                {selectedFile.protected && (
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 font-mono">
                    Protected Config
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Size: {selectedFile.size} · Modified: {selectedFile.modified}
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedFile.content);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Content'}</span>
            </button>
          </div>

          {selectedFile.protected && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Protected Resource: Overwriting or deleting this file requires explicit owner approval in the Approval Center.
              </span>
            </div>
          )}

          <pre className="p-4 rounded-xl bg-[#040711] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed h-72">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
